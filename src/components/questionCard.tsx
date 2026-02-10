import React from "react";
import { Button } from "./ui/button";
import type { Question } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useQuestionStore } from "@/store/useQuestionStore";

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
		const setQuestion = useQuestionStore((s) => s.setQuestions);
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
				onDragOver={(e) => e.preventDefault()}
				onDrop={(e) => {
					e.preventDefault();

					const raw = e.dataTransfer.getData("application/json");
					if (!raw) return;

					const parsed = JSON.parse(raw);

					setQuestion((prev) =>
						prev.map((question) => {
							if (question.id !== q.id) return question;

							if (parsed.type === "topic") {
								return {
									...question,
									Topics: [...(question.Topics || []), parsed.data],
									subTopics: [...(question.subTopics || []), ...(parsed.subtopics || [])],
								};
							}

							if (parsed.type === "subtopic") {
								return {
									...question,
									subTopics: [...(question.subTopics || []), parsed.data],
								};
							}

							return question;
						}),
					);
				}}
			>
				<span className="text-lg">
					{index + 1}. {q.title}
				</span>

				<div className="flex gap-3 items-center" onClick={(e) => e.stopPropagation()}>
					{((q.Topics !== undefined && q.Topics?.length !== 0) ||
						(q.subTopics !== undefined && q.subTopics?.length !== 0)) && (
						<Dialog>
							<DialogTrigger asChild>
								<Button className="border border-blue-600 hover:border-blue-700 mx-2 group cursor-pointer hover:text-orange-300">
									Topics<span className=" group-hover:inline-block hidden transition-all ease-out ">/ SubTopics</span>
								</Button>
							</DialogTrigger>
							<DialogContent className="bg-[#111010] text-white border-slate-700 max-w-lg">
								<DialogHeader>
									<DialogTitle className="text-xl font-semibold tracking-wide">Topics / SubTopics</DialogTitle>
								</DialogHeader>

								<div className="space-y-6 py-2">
									<div className="space-y-3">
										<h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Topics</h3>

										{q.Topics && q.Topics.length > 0 ? (
											<div className="flex flex-wrap gap-2">
												{q.Topics.map((ele) => (
													<span
														key={ele.id}
														className="px-3 py-1 rounded-full text-xs font-medium 
							bg-purple-600/20 border border-purple-500/40 
							text-purple-300 backdrop-blur-sm"
													>
														{ele.title}
													</span>
												))}
											</div>
										) : (
											<p className="text-slate-500 text-sm">No topics attached</p>
										)}
									</div>

									<div className="space-y-3">
										<h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Subtopics</h3>

										{q.subTopics && q.subTopics.length > 0 ? (
											<div className="flex flex-wrap gap-2">
												{q.subTopics.map((ele) => (
													<span
														key={ele.id}
														className="px-3 py-1 rounded-full text-xs font-medium 
							bg-blue-600/20 border border-blue-500/40 
							text-blue-300 backdrop-blur-sm"
													>
														{ele.title}
													</span>
												))}
											</div>
										) : (
											<p className="text-slate-500 text-sm">No subtopics attached</p>
										)}
									</div>
								</div>
							</DialogContent>
						</Dialog>
					)}

					<span className="px-2 py-1 text-xs rounded-lg bg-black/30">{q.difficulty}</span>
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
	},
);
