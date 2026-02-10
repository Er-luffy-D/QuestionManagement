export type Question = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  completed: boolean;
};

export type SubTopic = {
  id: string;
  title: string;
  questions: Question[];
};

export type Topic = {
  id: string;
  title: string;
  subTopics: SubTopic[];
};
