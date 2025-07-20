"use client";
import { motion } from "framer-motion";
import { FiBriefcase, FiPocket, FiAward, FiCode, FiBook } from "react-icons/fi";

const careerTimeline = [
  {
    icon: FiCode,
    company: "Alphabet Inc.",
    period: "2018 - 2019",
    role: "Frontend Developer",
    description:
      "Worked on Google Search UI improvements and performance optimization. Contributed to open-source web components library.",
    highlights: [
      "Improved page load speed by 30%",
      "Mentored 3 junior developers",
      "Won internal hackathon for accessibility features",
    ],
  },
  {
    icon: FiPocket,
    company: "Tesla Inc.",
    period: "2020 - 2021",
    role: "Senior UI Engineer",
    description:
      "Led dashboard redesign for Tesla Energy products. Implemented real-time data visualization for powerwall systems.",
    highlights: [
      "Reduced customer support queries by 40%",
      "Patented 2 visualization techniques",
      "Featured in Tesla's annual tech review",
    ],
  },
  {
    icon: FiBriefcase,
    company: "Amazon Inc.",
    period: "2004 - 2020",
    role: "Product Manager",
    description:
      "Managed AWS developer tools portfolio. Launched 3 major services used by millions of developers worldwide.",
    highlights: [
      "Grew revenue by 200% in 3 years",
      "Built team from 5 to 50 engineers",
      "Speaker at AWS re:Invent 2019",
    ],
  },
  {
    icon: FiBook,
    company: "Toyota",
    period: "2002 - 2022",
    role: "CTO",
    description:
      "Transformed digital infrastructure for connected vehicles. Established AI research lab for autonomous driving.",
    highlights: [
      "Reduced cloud costs by $12M/year",
      "Led acquisition of 3 startups",
      "Featured in Forbes Tech 50",
    ],
  },
];

export default function CareerGrowth() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container m-auto md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="logo text-4xl md:text-6xl font-bold mb-5">
            Career Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My professional timeline with key milestones and achievements
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-orange-500 to-violet-500 transform -translate-x-1/2"></div>

          {careerTimeline.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`mb-12 md:mb-16 flex flex-col md:flex-row ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center`}
            >
              {/* Timeline dot */}
              <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-primary border-4 border-background z-10"></div>

              {/* Content card */}
              <motion.div
                whileHover={{ y: -5 }}
                className={`w-full md:w-5/12 ${
                  index % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
                } relative`}
              >
                <div className="bg-background p-6 rounded-xl shadow-lg border hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{item.company}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.period}
                      </p>
                    </div>
                  </div>

                  <h4 className="font-medium mb-2 text-primary">{item.role}</h4>
                  <p className="text-muted-foreground mb-4">
                    {item.description}
                  </p>

                  <div className="space-y-2">
                    {item.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <FiAward className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                        <p className="text-sm">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Date marker for mobile */}
              <div className="md:hidden mt-4 px-4 py-2 bg-muted rounded-full text-sm font-medium">
                {item.period}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground italic">
            {
              "The success of every career depends on continuous learning and adaptation."
            }
          </p>
        </motion.div>
      </div>
    </section>
  );
}
