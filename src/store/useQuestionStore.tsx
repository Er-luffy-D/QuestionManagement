import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { Question, Topic } from "../types";

type QuestionStore = {
	questions: Question[];
	topics: Topic[];

	// setters
	setQuestions: (fn: (prev: Question[]) => Question[]) => void;
	setTopics: (fn: (prev: Topic[]) => Topic[]) => void;

	addQuestion: (q: Question) => void;
};

export const useQuestionStore = create<QuestionStore>()(
	devtools(
		(set) => ({
			questions: [],
			topics: [],

			setQuestions: (fn) =>
				set(
					(state) => ({
						questions: fn(state.questions),
					}),
					false,
					"questions/setQuestions",
				),

			setTopics: (fn) =>
				set(
					(state) => ({
						topics: fn(state.topics),
					}),
					false,
					"topics/setTopics",
				),

			addQuestion: (q) =>
				set(
					(state) => ({
						questions: [...state.questions, q],
					}),
					false,
					"questions/addQuestion",
				),
		}),
		{
			name: "QuestionStore", // shows in Redux DevTools
		},
	),
);
