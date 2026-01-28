"use client";

import type { Comment } from "@/types";
import Logger from "dev-console-kit";
import type React from "react";
import { useEffect, useState } from "react";

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/blogs/${postId}/comments`);
      const result = await response.json();

      if (result.success) {
        setComments(result.data);
      }
    } catch (error) {
      Logger.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !content.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/blogs/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          comment: content.trim(),
        }),
      });

      if (response.ok) {
        // Reset form
        setName("");
        setEmail("");
        setContent("");
        setShowForm(false);

        // Refresh comments
        await fetchComments();
      } else {
        alert("Failed to add comment. Please try again.");
      }
    } catch (error) {
      Logger.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="pt-8 border-t border-white/20 dark:border-gray-600/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white dark:text-gray-800">
          Comments ({comments.length})
        </h3>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#CA3E47] text-white rounded-lg hover:bg-[#B8353E] transition-colors duration-300">
          {showForm ? "Cancel" : "Add Comment"}
        </button>
      </div>

      {/* Comment Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-6 mb-8 rounded-lg bg-white/5 dark:bg-gray-800/30">
          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-300 dark:text-gray-600">
                Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 dark:bg-white border border-white/20 dark:border-gray-300 rounded-md text-white dark:text-gray-900 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#CA3E47] focus:border-transparent"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-300 dark:text-gray-600">
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 dark:bg-white border border-white/20 dark:border-gray-300 rounded-md text-white dark:text-gray-900 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#CA3E47] focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="content"
              className="block mb-2 text-sm font-medium text-gray-300 dark:text-gray-600">
              Comment *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-white/10 dark:bg-white border border-white/20 dark:border-gray-300 rounded-md text-white dark:text-gray-900 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#CA3E47] focus:border-transparent resize-vertical"
              placeholder="Write your comment here..."
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-[#CA3E47] text-white rounded-lg hover:bg-[#B8353E] focus:outline-none focus:ring-2 focus:ring-[#CA3E47] focus:ring-offset-2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting && (
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <svg
            className="w-8 h-8 animate-spin text-[#CA3E47]"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-6 border rounded-lg bg-white/5 dark:bg-gray-800/30 border-white/10 dark:border-gray-600/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#CA3E47] rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {comment.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white dark:text-gray-800">
                      {comment.name}
                    </h4>
                    <p className="text-sm text-gray-400 dark:text-gray-600">
                      {formatDate(comment.date)}
                    </p>
                  </div>
                </div>
              </div>

              <p className="leading-relaxed text-gray-200 whitespace-pre-wrap dark:text-gray-700">
                {comment.comment}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="mb-4 text-gray-400 dark:text-gray-600">
            No comments yet
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-700">
            Be the first to share your thoughts!
          </p>
        </div>
      )}
    </div>
  );
}
