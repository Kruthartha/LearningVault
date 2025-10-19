import axios from "axios";

const RUNTIME_API_URL = "https://runtime.learningvault.in/api/v2/execute";
const RUNTIME_API_KEY = process.env.RUNTIME_API_KEY;


export const executeCode = async (req, res) => {
  try {
    const { language, version, files } = req.body;

    if (!language || !files?.length) {
      return res.status(400).json({ error: "Invalid request format" });
    }

    console.log("Sending request to Runtime API with X-API-Key");

    const response = await axios.post(
      RUNTIME_API_URL,
      { language, version, files },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": RUNTIME_API_KEY,
        },
        timeout: 20000,
      }
    );

    res.status(200).json(response.data);
  } catch (err) {
    console.error("Execution error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Code execution failed",
      details: err.response?.data || err.message,
    });
  }
};