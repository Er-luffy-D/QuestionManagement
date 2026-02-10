import { useCallback, useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "./components/ui/dialog";

import type { Question, Topic } from "./types";
import { QuestionCard } from "./components/questionCard";
import { useQuestionStore } from "./store/useQuestionStore";
import SheetData from "@/data/sheet.json";

export default function App() {
	const [questionInput, setQuestionInput] = useState("");

	const [difficulty, setDifficulty] = useState<string>("Easy");

	const questions = useQuestionStore((s) => s.questions);
	const topics = useQuestionStore((s) => s.topics);

	const setQuestions = useQuestionStore((s) => s.setQuestions);
	const setTopics = useQuestionStore((s) => s.setTopics);

	const addQuestion = useCallback(() => {
		if (!questionInput.trim()) return;

		const newQuestion: Question = {
			id: crypto.randomUUID(),
			title: questionInput,
			difficulty,
			completed: false,
		};

		setQuestions((prev) => [...prev, newQuestion]);
		setQuestionInput("");
	}, [questionInput, difficulty, setQuestions]);

	const deleteQuestion = useCallback(
		(id: string) => {
			setQuestions((prev) => prev.filter((q) => q.id !== id));
		},
		[setQuestions],
	);

	const toggleComplete = useCallback(
		(id: string) => {
			setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, completed: !q.completed } : q)));
		},
		[setQuestions],
	);

	const [topicTitle, setTopicTitle] = useState("");

	const handleAddTopic = () => {
		if (!topicTitle.trim()) return;

		setTopics((prev) => [
			...prev,
			{
				id: crypto.randomUUID(),
				title: topicTitle,
				subTopics: [],
			},
		]);

		setTopicTitle("");
	};

	const handleUpdateData = () => {
		SheetData.data.questions.forEach((entry) => {
			const question = {
				id: entry.questionId._id,
				title: entry.questionId.name,
				difficulty: entry.questionId.difficulty as "Easy" | "Medium" | "Hard",
				completed: !!entry.isSolved,

				Topics: [
					{
						id: crypto.randomUUID(),
						title: entry.topic,
						subTopics: [],
					},
				],

				subTopics: [
					{
						id: crypto.randomUUID(),
						title: entry.subTopic,
					},
				],
			};

			setQuestions((prev) => [...prev, question]);

			setTopics((prev) => {
				const existingTopic = prev.find((t) => t.title === entry.topic);

				if (existingTopic) {
					if (!existingTopic.subTopics.find((st) => st.title === entry.subTopic)) {
						existingTopic.subTopics.push({
							id: crypto.randomUUID(),
							title: entry.subTopic,
						});
					}

					return [...prev];
				}

				return [
					...prev,
					{
						id: crypto.randomUUID(),
						title: entry.topic,
						subTopics: [
							{
								id: crypto.randomUUID(),
								title: entry.subTopic,
							},
						],
					},
				];
			});
		});
	};

	return (
		<div className="h-full text-white">
			<div className="h-15 bg-[#161619] border-b-2 border-slate-400/25">
				<Button
					onClick={handleUpdateData}
					className="absolute right-0 hover:bg-red-500/50 bg-red-500/50 cursor-pointer backdrop-blur-2xl top-1 m-2"
				>
					Populate Data
				</Button>
			</div>

			<div className="h-full min-h-screen bg-[#111010]">
				<div className="p-5">
					<h1 className="text-3xl">Questions</h1>
					<h2 className="text-lg">Keep track of all your questions here</h2>

					<div className="py-8 border-dashed border-2 my-5 rounded-2xl flex flex-col gap-4">
						{/* ---------------- ADD QUESTION ---------------- */}

						<div className="px-8 flex gap-4 justify-between">
							<Input
								placeholder="Question Name"
								className="bg-[#27272A] text-white"
								value={questionInput}
								onChange={(e) => setQuestionInput(e.target.value)}
							/>

							<Select onValueChange={(e) => setDifficulty(e as "Easy" | "Medium" | "Hard")}>
								<SelectTrigger className="w-60 bg-[#27272A] text-white">
									<SelectValue placeholder="Select Difficulty" />
								</SelectTrigger>

								<SelectContent className="bg-[#27272A] text-white">
									<SelectGroup>
										<SelectItem value="Easy">Easy</SelectItem>
										<SelectItem value="Medium">Medium</SelectItem>
										<SelectItem value="Hard">Hard</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>

							<Button className="bg-[#F57C06] hover:bg-[#F57C06] w-27" onClick={addQuestion}>
								Add
							</Button>
						</div>

						{/* ---------------- TOPICS ---------------- */}

						<div className="px-5 space-y-4">
							<Dialog>
								<DialogTrigger asChild>
									<Button className="bg-blue-600 hover:bg-blue-700 mx-2">Add Topic</Button>
								</DialogTrigger>

								<DialogContent className="bg-[#111010] text-white border-slate-700">
									<DialogHeader>
										<DialogTitle>Add New Topic</DialogTitle>
									</DialogHeader>

									<Input
										placeholder="Enter topic name..."
										value={topicTitle}
										onChange={(e) => setTopicTitle(e.target.value)}
										className="bg-[#27272A] text-white"
									/>

									<DialogFooter>
										<Button onClick={handleAddTopic} className="bg-[#F57C06]">
											Add
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>

							<p className="text-slate-300 pl-2">Topics :</p>

							<div
								className="ml-2
							bg-slate-700/80
							p-3
							rounded-2xl

							flex flex-wrap gap-3
							max-h-65
							overflow-y-auto

							scrollbar-thin
							scrollbar-thumb-slate-600
							scrollbar-track-transparent"
							>
								{topics.length === 0 && <p className="text-slate-500 ml-3">No topics added yet.</p>}

								{topics.map((topic) => (
									<TopicDiv key={topic.id} topic={topic} />
								))}
							</div>
						</div>
					</div>

					{/* ---------------- QUESTIONS LIST ---------------- */}

					<div className="space-y-3">
						{questions.length === 0 && <p className="text-slate-500 text-center py-10">No questions added yet.</p>}

						{questions.map((q, index) => (
							<QuestionCard
								key={q.id}
								index={index}
								q={q}
								deleteQuestion={deleteQuestion}
								toggleComplete={toggleComplete}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

const TopicDiv = ({ topic }: { topic: Topic }) => {
	const [onOpen, setOnOpen] = useState(false);
	const [subTopicTitle, setSubTopicTitle] = useState("");
	const setTopics = useQuestionStore((s) => s.setTopics);
	const handleAddSubTopic = () => {
		if (!subTopicTitle.trim()) return;

		setTopics((prev) =>
			prev.map((t) =>
				t.id === topic.id
					? {
							...t,
							subTopics: [
								...t.subTopics,
								{
									id: crypto.randomUUID(),
									title: subTopicTitle,
								},
							],
						}
					: t,
			),
		);

		setSubTopicTitle("");
	};

	if (onOpen) {
		return (
			<div
				onClick={() => setOnOpen((cur) => !cur)}
				className="
						border border-slate-400
						bg-gray-950
						rounded-lg
						px-3 py-2
						min-w-32
						max-w-130
						flex gap-4
						cursor-pointer
						"
				draggable
				onDragStart={(e) => {
					e.dataTransfer.setData(
						"application/json",
						JSON.stringify({
							type: "topic",
							data: topic,
							subtopics: topic.subTopics,
						}),
					);
				}}
			>
				<h3 className="font-semibold">{topic.title}</h3>

				<div className="flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-105">
						{topic.subTopics.map((subTopic) => (
							<div
								key={subTopic.id}
								draggable
								onDragStart={(e) => {
									e.stopPropagation();

									e.dataTransfer.setData(
										"application/json",
										JSON.stringify({
											type: "subtopic",
											data: subTopic,
										}),
									);
								}}
								className="
									border border-blue-500
									rounded-xl
									px-3 py-1
									text-xs
									max-w-40
									wrap-break-word
									whitespace-normal
									text-center
									bg-blue-500/10
									"
							>
								{subTopic.title}
							</div>
						))}
					</div>
					<Dialog>
						<DialogTrigger asChild>
							<Button className="border-green-500 border text-xs ">Add Subtopic</Button>
						</DialogTrigger>

						<DialogContent className="bg-[#111010] text-white border-slate-700">
							<DialogHeader>
								<DialogTitle>Add Subtopic</DialogTitle>
							</DialogHeader>

							<Input
								placeholder="Enter subtopic name..."
								value={subTopicTitle}
								onChange={(e) => setSubTopicTitle(e.target.value)}
								className="bg-[#27272A] text-white"
							/>

							<DialogFooter>
								<Button onClick={handleAddSubTopic} className="bg-[#F57C06]">
									Add
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		);
	}

	return (
		<div
			onClick={() => setOnOpen((cur) => !cur)}
			className="border border-slate-400 bg-gray-950 rounded-lg px-2 py-1 min-w-20 text-center flex gap-7 w-max cursor-pointer"
			draggable
			onDragStart={(e) => {
				e.dataTransfer.setData(
					"application/json",
					JSON.stringify({
						type: "topic",
						data: topic,
					}),
				);
			}}
		>
			<h3 className="font-semibold">{topic.title}</h3>
		</div>
	);
};
