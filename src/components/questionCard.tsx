import React from "react";
import { Button } from "./ui/button";
import type { Question } from "../types";

export const QuestionCard = React.memo(
  ({
    q,
    index,
    toggleComplete,
    deleteQuestion,
  }: {
    q: Question;
    index: number;
    toggleComplete: (id: string) => void;
    deleteQuestion: (id: string) => void;
  }) => {
    return (
      <div
        onClick={() => toggleComplete(q.id)}
        className={`
          cursor-pointer flex items-center justify-between
          p-4 rounded-xl border transition-colors duration-200
          ${
            q.completed
              ? "bg-green-400 hover:bg-green-500 border-white text-white"
              : "bg-[#1A1A1D] hover:bg-[#2d2d30] border-slate-700 text-white"
          }
        `}
      >
        <span className="text-lg">
          {index + 1}. {q.title}
        </span>

        <div className="flex gap-3 items-center">
          <span className="px-2 py-1 text-xs rounded-lg bg-black/30">
            {q.difficulty}
          </span>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              deleteQuestion(q.id);
            }}
            className="bg-red-600 hover:bg-red-700 px-3"
          >
            Delete
          </Button>
        </div>
      </div>
    );
  }
);
