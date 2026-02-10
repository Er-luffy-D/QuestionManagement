export type Question = {
	id: string;
	title: string;
	difficulty: "Easy" | "Medium" | "Hard";
	completed: boolean;
	subTopics?: SubTopic[];
	Topics?: Topic[];
};
export type SubTopic = {
	id: string;
	title: string;
};

export type Topic = {
	id: string;
	title: string;
	subTopics: SubTopic[];
};
