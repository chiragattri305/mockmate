import Head from "next/head";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HowItWorks = () => {
  return (
    <>
      <Head>
        <title>How It Works - MockMate</title>
        <meta
          name="description"
          content="Learn how MockMate works."
        />
      </Head>
      <main className="mx-auto max-w-2xl p-4 sm:p-8 mt-6 md:mt-10">
        <h1 className="font-display text-3xl md:text-4xl text-center mb-8">How It Works</h1>
        <section className="space-y-8">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <h2 className="text-xl md:text-2xl font-semibold mb-4">
                  Step 1: Prepare for the Interview
                </h2>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">
                  Get ready by selecting the type of interview and providing
                  some details about the job position.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                {" "}
                <h2 className="text-xl md:text-2xl font-semibold mb-4">
                  Step 2: Start the AI Interview
                </h2>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">
                  Our AI will ask you a series of questions and evaluate your
                  responses in real-time.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                <h2 className="text-xl md:text-2xl font-semibold mb-4">
                  Step 3: Receive Feedback
                </h2>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">
                  Get detailed feedback on your performance, including strengths
                  and areas for improvement.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>
    </>
  );
};

export default HowItWorks;
