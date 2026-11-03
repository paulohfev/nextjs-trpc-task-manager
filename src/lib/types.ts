export type Task = {
  id: string;
  title: string;
  description?: string;
  creationDate: string;
};

export type FeedbackVariant = "success" | "error";
