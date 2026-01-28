"use client";

import Logger from "dev-console-kit";
import { useEffect, useState } from "react";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
}

export default function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user has already liked this post
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    setIsLiked(likedPosts.includes(postId));
  }, [postId]);

  const handleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");

    try {
      if (isLiked) {
        // Unlike - MongoDB'den 1 azalt
        const response = await fetch(`/api/blogs/${postId}/like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "unlike" }),
        });

        if (response.ok) {
          const data = await response.json();
          setLikes(data.likes);
          setIsLiked(false);

          // Remove from localStorage
          const updatedLikedPosts = likedPosts.filter(
            (id: string) => id !== postId,
          );
          localStorage.setItem("likedPosts", JSON.stringify(updatedLikedPosts));
        }
      } else {
        // Like - MongoDB'de 1 artır
        const response = await fetch(`/api/blogs/${postId}/like`, {
          method: "POST",
        });

        if (response.ok) {
          const data = await response.json();
          setLikes(data.likes);
          setIsLiked(true);

          // Add to localStorage
          likedPosts.push(postId);
          localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
        }
      }
    } catch (error) {
      Logger.error("Error updating likes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
        isLiked
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
      } disabled:opacity-50 disabled:cursor-not-allowed`}>
      <svg
        className={`w-5 h-5 transition-transform duration-300 ${
          isLiked ? "scale-110" : ""
        }`}
        fill={isLiked ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="font-medium">{likes}</span>
      {isLoading && (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
    </button>
  );
}
