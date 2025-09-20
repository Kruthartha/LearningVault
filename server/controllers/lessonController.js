import { pool } from '../config/db.js';

/**
 * @desc    Create a new lesson with its steps
 * @route   POST /api/studio/lessons
 * @access  Private (Content Creator, Admin)
 */
export const createLesson = async (req, res) => {
  const { title, description, steps } = req.body; // `steps` is an array of step objects
  const authorId = req.user.id;

  if (!title || !Array.isArray(steps)) {
    return res.status(400).json({ message: 'Title and a steps array are required.' });
  }

  const client = await pool.connect();

  try {
    // Start a transaction
    await client.query('BEGIN');

    // 1. Insert the main lesson record
    const lessonQuery = `
      INSERT INTO lessons (title, description, author_id) 
      VALUES ($1, $2, $3) 
      RETURNING lesson_id
    `;
    const lessonResult = await client.query(lessonQuery, [title, description || null, authorId]);
    const { lesson_id } = lessonResult.rows[0];

    // 2. Insert all the lesson steps
    if (steps.length > 0) {
      const stepInsertPromises = steps.map((step, index) => {
        const stepQuery = `
          INSERT INTO lesson_steps (lesson_id, step_order, title, bits) 
          VALUES ($1, $2, $3, $4)
        `;
        // The `bits` column should receive a valid JSON object
        return client.query(stepQuery, [lesson_id, index + 1, step.title || null, step.bits || '{}']);
      });
      await Promise.all(stepInsertPromises);
    }
    
    // Commit the transaction
    await client.query('COMMIT');

    res.status(201).json({ message: 'Lesson created successfully', lesson_id });

  } catch (error) {
    // If any part fails, roll back the entire transaction
    await client.query('ROLLBACK');
    console.error('Error creating lesson:', error);
    res.status(500).json({ message: 'Server error while creating lesson.' });
  } finally {
    client.release();
  }
};


/**
 * @desc    Get all lessons (metadata only, no steps)
 * @route   GET /api/studio/lessons
 * @access  Private
 */
export const getAllLessons = async (req, res) => {
  try {
    const query = `
      SELECT l.lesson_id, l.title, l.status, l.version, l.updated_at, u.first_name, u.last_name
      FROM lessons l
      LEFT JOIN studio_users u ON l.author_id = u.id
      ORDER BY l.updated_at DESC
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching all lessons:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


/**
 * @desc    Get a single lesson by ID, including all its steps
 * @route   GET /api/studio/lessons/:lessonId
 * @access  Private
 */
export const getLessonById = async (req, res) => {
  const { lessonId } = req.params;
  try {
    // This query efficiently fetches the lesson and aggregates its steps into a JSON array
    const query = `
      SELECT 
        l.*,
        COALESCE(
          (SELECT json_agg(s.* ORDER BY s.step_order ASC)
           FROM lesson_steps s
           WHERE s.lesson_id = l.lesson_id),
          '[]'::json
        ) AS steps
      FROM lessons l
      WHERE l.lesson_id = $1
    `;
    const { rows } = await pool.query(query, [lessonId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching lesson by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


/**
 * @desc    Update a lesson and its steps
 * @route   PUT /api/studio/lessons/:lessonId
 * @access  Private
 */
export const updateLesson = async (req, res) => {
  const { lessonId } = req.params;
  const { title, description, status, steps } = req.body;

  if (!title || !status || !Array.isArray(steps)) {
    return res.status(400).json({ message: 'Title, status, and steps array are required' });
  }
  if (!['draft', 'published', 'archived'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Update the lesson details and increment its version
    const lessonQuery = `
      UPDATE lessons 
      SET title = $1, description = $2, status = $3, version = version + 1
      WHERE lesson_id = $4
    `;
    const lessonResult = await client.query(lessonQuery, [title, description || null, status, lessonId]);
    
    if (lessonResult.rowCount === 0) {
      throw new Error('Lesson not found');
    }

    // 2. A simple and robust way to update steps is to delete the old ones and insert the new ones
    await client.query('DELETE FROM lesson_steps WHERE lesson_id = $1', [lessonId]);
    
    // 3. Insert the new set of steps
    if (steps.length > 0) {
        const stepInsertPromises = steps.map((step, index) => {
            const stepQuery = `
              INSERT INTO lesson_steps (lesson_id, step_order, title, bits) 
              VALUES ($1, $2, $3, $4)
            `;
            return client.query(stepQuery, [lessonId, index + 1, step.title || null, step.bits || '{}']);
        });
        await Promise.all(stepInsertPromises);
    }
    
    await client.query('COMMIT');
    
    res.json({ message: 'Lesson updated successfully' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating lesson:', error);
    if (error.message === 'Lesson not found') {
        return res.status(404).json({ message: 'Lesson not found' });
    }
    res.status(500).json({ message: 'Server error while updating lesson' });
  } finally {
    client.release();
  }
};


/**
 * @desc    Delete a lesson
 * @route   DELETE /api/studio/lessons/:lessonId
 * @access  Private
 */
export const deleteLesson = async (req, res) => {
  const { lessonId } = req.params;
  try {
    const result = await pool.query('DELETE FROM lessons WHERE lesson_id = $1', [lessonId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // The `onDelete: "cascade"` in your migration automatically deletes all associated lesson_steps.
    res.status(204).send(); // Standard "No Content" response for successful deletion
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ message: 'Server error' });
  }
};