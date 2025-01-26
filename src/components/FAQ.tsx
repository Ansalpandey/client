import { Accordion, Content, Tab, Trigger } from "./Accordion";

interface Question {
  question: string;
  answer: string;
}

export default function Faq() {
  return (
    <div className="flex w-full items-start justify-center bg-black py-10">
      <div className="right-40 left-40 w-full max-w-full-lg px-4">
        <h1 className="text-4xl font-bold text-white text-center py-10">
          Frequently Asked Questions
        </h1>
        <Accordion>
          {questions.map((e, i) => {
            return (
              <Tab key={i}>
                <Trigger>{e.question}</Trigger>
                <Content>{e.answer}</Content>
              </Tab>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}

const questions: Question[] = [
  {
    question: "What makes your cloud IDE different from others?",
    answer: "Our cloud IDE is designed specifically for developers who need a fast, reliable, and customizable coding environment. We offer seamless integrations, zero setup time, and support for a wide range of programming languages, all with a highly responsive UI and powerful backend infrastructure."
  },
  {
    question: "Is your cloud IDE suitable for team collaboration?",
    answer: "Absolutely! Our cloud IDE enables real-time collaboration, so multiple developers can work on the same codebase simultaneously. It’s perfect for teams working on joint projects, offering features like version control and instant sharing of resources."
  },
  {
    question: "What kind of support can users expect?",
    answer: "We offer 24/7 customer support through both live chat and email. Additionally, we provide a comprehensive knowledge base, and our AI-powered support agents are available at all times to assist with common issues, making it easier for developers to focus on their code."
  },
  {
    question: "How secure is your cloud IDE?",
    answer: "Security is our top priority. We use end-to-end encryption for all user data and implement regular security audits to ensure your projects are safe. You can also enable two-factor authentication for additional security on your account."
  },
  {
    question: "Can I access my projects from any device?",
    answer: "Yes, you can! Our cloud IDE is completely browser-based, which means you can access your projects from any device with an internet connection. Whether you're on a laptop, tablet, or phone, your development environment is always available."
  },
];
