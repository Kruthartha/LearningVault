import { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  MessageSquare,
  Heart,
} from "lucide-react";

const Community = () => {
  const [activeTab, setActiveTab] = useState("discussions");

  const discussions = [
    {
      id: 1,
      title: "Best practices for React state management in 2024?",
      author: "Sarah Johnson",
      avatar: "SJ",
      replies: 23,
      likes: 45,
      timeAgo: "2h ago",
      tags: ["React", "State Management", "Redux"],
      isAnswered: true,
    },
    {
      id: 2,
      title: "How to optimize database queries in Node.js applications",
      author: "Mike Chen",
      avatar: "MC",
      replies: 12,
      likes: 31,
      timeAgo: "4h ago",
      tags: ["Node.js", "Database", "Performance"],
      isAnswered: false,
    },
    {
      id: 3,
      title: "Career advice: Transitioning from frontend to full-stack",
      author: "Emily Rodriguez",
      avatar: "ER",
      replies: 18,
      likes: 62,
      timeAgo: "1d ago",
      tags: ["Career", "Full-Stack", "Advice"],
      isAnswered: true,
    },
  ];

  const studyGroups = [
    {
      id: 1,
      name: "React Study Group",
      members: 24,
      nextSession: "Tomorrow 7PM",
      topic: "Advanced React Patterns",
      isJoined: true,
    },
    {
      id: 2,
      name: "JavaScript Algorithms",
      members: 18,
      nextSession: "Friday 6PM",
      topic: "Dynamic Programming",
      isJoined: false,
    },
    {
      id: 3,
      name: "Full-Stack Project Team",
      members: 12,
      nextSession: "Sunday 3PM",
      topic: "E-commerce Platform Build",
      isJoined: true,
    },
  ];

  const events = [
    {
      id: 1,
      title: "Web Development Workshop",
      date: "Feb 15, 2024",
      time: "2:00 PM - 4:00 PM",
      attendees: 45,
      type: "Workshop",
      isRegistered: true,
    },
    {
      id: 2,
      title: "Career Fair 2024",
      date: "Feb 22, 2024",
      time: "10:00 AM - 6:00 PM",
      attendees: 120,
      type: "Career Fair",
      isRegistered: false,
    },
    {
      id: 3,
      title: "Tech Talk: Future of AI",
      date: "Mar 5, 2024",
      time: "7:00 PM - 8:30 PM",
      attendees: 89,
      type: "Tech Talk",
      isRegistered: false,
    },
  ];

  const DiscussionCard = ({ discussion }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
          {discussion.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
              {discussion.title}
            </h3>
            {discussion.isAnswered && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </div>
          <p className="text-sm text-gray-600 mb-3">by {discussion.author}</p>

          <div className="flex flex-wrap gap-1 mb-4">
            {discussion.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{discussion.replies} replies</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{discussion.likes} likes</span>
              </div>
            </div>
            <span>{discussion.timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const StudyGroupCard = ({ group }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {group.name}
          </h3>
          <p className="text-sm text-gray-600">{group.members} members</p>
        </div>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            group.isJoined
              ? "bg-green-50 text-green-600 border border-green-200"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {group.isJoined ? "Joined" : "Join"}
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Next session:</span>
          <span className="font-medium text-gray-900">{group.nextSession}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Topic:</span>
          <span className="font-medium text-gray-900">{group.topic}</span>
        </div>
      </div>
    </div>
  );

  const EventCard = ({ event }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium mb-2 inline-block ${
              event.type === "Workshop"
                ? "bg-blue-100 text-blue-600"
                : event.type === "Career Fair"
                ? "bg-green-100 text-green-600"
                : "bg-purple-100 text-purple-600"
            }`}
          >
            {event.type}
          </span>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {event.title}
          </h3>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{event.attendees} attendees</span>
            </div>
          </div>
        </div>
      </div>

      <button
        className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
          event.isRegistered
            ? "bg-green-50 text-green-600 border border-green-200"
            : "bg-slate-800 text-white hover:bg-slate-700"
        }`}
      >
        {event.isRegistered ? "Registered" : "Register"}
      </button>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-light text-black mb-4">Community</h2>
        <p className="text-xl text-gray-600 font-light">
          Connect, learn, and grow with fellow developers
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
        <div className="flex gap-1">
          {[
            { key: "discussions", label: "Discussions", icon: MessageSquare },
            { key: "study-groups", label: "Study Groups", icon: Users },
            { key: "events", label: "Events", icon: Calendar },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === key
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "discussions" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium text-gray-900">
              Recent Discussions
            </h3>
            <button className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
              Start Discussion
            </button>
          </div>
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <DiscussionCard key={discussion.id} discussion={discussion} />
            ))}
          </div>
        </div>
      )}

      {activeTab === "study-groups" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium text-gray-900">Study Groups</h3>
            <button className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
              Create Group
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyGroups.map((group) => (
              <StudyGroupCard key={group.id} group={group} />
            ))}
          </div>
        </div>
      )}

      {activeTab === "events" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium text-gray-900">
              Upcoming Events
            </h3>
            <button className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
              Propose Event
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
