import { useState, useEffect, useRef } from "react";
import { useSEO } from "@/hooks/useSEO";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, ClipboardCopy, Check, Dices, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RetroCard {
  id: string;
  title: string;
  goal: string;
  process: string;
  /** Optional visual example shown inside the card (e.g. a filled-in sample) */
  exampleIllustration?: React.ReactNode;
  /** Download URL for the example illustration */
  exampleDownloadHref?: string;
  /** Optional blank template shown inside the card (e.g. an empty grid to copy) */
  templateIllustration?: React.ReactNode;
  /** Download URL for the template illustration */
  templateDownloadHref?: string;
}

interface RetroStage {
  id: string;
  number: number;
  name: string;
  /** CSS color value used for the left border and glow */
  color: string;
  /** Lighter tint for the selected glow ring */
  glowColor: string;
  cards: RetroCard[];
}

// ─── Card Data ─────────────────────────────────────────────────────────────────
// Each stage holds an array of RetroCard objects.
// Add more cards here freely — the carousel handles any number.

const STAGES: RetroStage[] = [
  // ── 1. Opening ─────────────────────────────────────────────────────────────
  {
    id: "opening",
    number: 1,
    name: "Opening",
    color: "#7c3aed",       // purple-700
    glowColor: "#7c3aed50", // purple semi-transparent
    cards: [
      {
        id: "opening-1",
        title: "Temperature Reading",
        goal: "Get a quick sense of how the team is feeling before the session kicks off.",
        process:
          "Write five categories on the flipchart: gratitude, confusion, complaints and suggestions, new information, hopes and wishes. Participation is voluntary, and no one comments on what others share. Go around the room and invite each person to speak up if they have something to say.",
        exampleIllustration: (
          <img
            src="/illustrations/temperature_reading_example.svg"
            alt="Temperature Reading — filled example"
            className="w-full h-auto"
          />
        ),
        exampleDownloadHref: "/illustrations/temperature_reading_example.svg",
        templateIllustration: (
          <img
            src="/illustrations/temperature_reading_template.svg"
            alt="Temperature Reading — blank template"
            className="w-full h-auto"
          />
        ),
        templateDownloadHref: "/illustrations/temperature_reading_template.svg",
      },
      {
        id: "opening-2",
        title: "One Word Retrospective",
        goal: "Start a conversation about feelings without making it awkward.",
        process:
          "Ask everyone to share one word describing how they felt during the last iteration. Write all the words on the flipchart, then go back and ask each person why they chose that word. This one touches on emotions, so make sure the space feels safe first. Remind the group of the Prime Directive if needed.",
      },
      {
        id: "opening-3",
        title: "Safety Check",
        goal: "Find out how comfortable people feel speaking openly before you start.",
        process:
          "Everyone anonymously writes a number from 1 to 5 on a sticky note. 1 means \"I'll smile but won't say what I actually think,\" 5 means \"I'll say anything.\" Collect the notes, build a quick histogram, and talk about it. If most scores are low, deal with that first. A retro where people hold back won't get you far.",
      },
      {
        id: "opening-4",
        title: "ESVP",
        goal: "Get an honest read on how engaged the group is coming in.",
        process:
          "Ask everyone to anonymously pick one role: Explorer (curious, wants to learn), Shopper (looking for one useful takeaway), Vacationer (happy to be away from regular work), Prisoner (would rather be somewhere else). Build a histogram from the answers. Naming the dynamic out loud often shifts it, even when the results are uncomfortable.",
        exampleIllustration: (
          <img
            src="/illustrations/esvp_example.svg"
            alt="ESVP — filled example"
            className="w-full h-auto"
          />
        ),
        exampleDownloadHref: "/illustrations/esvp_example.svg",
        templateIllustration: (
          <img
            src="/illustrations/esvp_template.svg"
            alt="ESVP — blank template"
            className="w-full h-auto"
          />
        ),
        templateDownloadHref: "/illustrations/esvp_template.svg",
      },
      {
        id: "opening-5",
        title: "Prime Directive",
        goal: "Set the right tone and keep the retro from turning into a blame session.",
        process:
          "Read the statement out loud: \"Regardless of what we discover, we understand and truly believe that everyone did the best job they could, given what they knew at the time, their skills, the resources available, and the situation at hand.\" Ask the group if they agree. It moves the conversation from \"who messed up\" to \"what can we improve.\"",
      },
      {
        id: "opening-6",
        title: "Weather Report",
        goal: "Give everyone a simple way to check in at the start.",
        process:
          "Ask each person to describe their current mood as a weather forecast. Sunny, cloudy, stormy, foggy, whatever fits. One sentence per person, no explanations needed. Go around until everyone has checked in, then use what you heard to set the pace for the session.",
      },
    ],
  },

  // ── 2. Data Gathering ───────────────────────────────────────────────────────
  {
    id: "data-gathering",
    number: 2,
    name: "Data Gathering",
    color: "#d97706",       // amber-600
    glowColor: "#d9770650",
    cards: [
      {
        id: "data-1",
        title: "Mad, Sad, Glad",
        goal: "Collect emotional feedback about the sprint in a format that's quick to run and easy for everyone to engage with.",
        process:
          "Draw three columns on the flipchart: Mad (things that frustrated or annoyed the team), Sad (things that disappointed or discouraged), Glad (things that went well or energized). Give everyone 5–7 minutes to write sticky notes silently, then post them in the right column. Read all notes aloud and group related themes. Works especially well with teams that are new to retrospectives.",
        exampleIllustration: (
          <img
            src="/illustrations/mad_sad_glad_example.svg"
            alt="Mad, Sad, Glad — filled example"
            className="w-full h-auto"
          />
        ),
        exampleDownloadHref: "/illustrations/mad_sad_glad_example.svg",
        templateIllustration: (
          <img
            src="/illustrations/mad_sad_glad_template.svg"
            alt="Mad, Sad, Glad — blank template"
            className="w-full h-auto"
          />
        ),
        templateDownloadHref: "/illustrations/mad_sad_glad_template.svg",
      },
      {
        id: "data-2",
        title: "Speed Boat",
        goal: "Identify what's driving the team forward and what's slowing them down.",
        process:
          "Draw a speedboat on the flipchart. The boat is your team. The engine pushing it forward represents strengths and things that help. The anchors dragging it back represent blockers and friction. Ask participants to write sticky notes for both and place them on the drawing. Walk through the results together, paying more attention to the anchors — those are your action items.",
      },
      {
        id: "data-3",
        title: "Timeline",
        goal: "Rebuild a shared picture of the sprint before discussing what to improve.",
        process:
          "Draw a horizontal line on the flipchart covering the sprint period. Ask everyone to place sticky notes marking significant events, milestones, blockers, or turning points at the right spot on the timeline. Include both facts and emotional reactions. Once the timeline is populated, walk through it together and look for patterns. Works especially well after long or turbulent sprints.",
        exampleIllustration: (
          <img
            src="/illustrations/timeline_example.svg"
            alt="Timeline — filled example"
            className="w-full h-auto"
          />
        ),
        exampleDownloadHref: "/illustrations/timeline_example.svg",
      },
      {
        id: "data-4",
        title: "Satisfaction Histogram",
        goal: "Get a quick, measurable read on how the team feels about working together.",
        process:
          "Ask participants to anonymously rate their satisfaction with the team on a scale of 1 to 5 using sticky notes. Use this scale: 5 — we are the best team in the world, 4 — I am glad to be part of this team and happy with how we work, 3 — satisfied, we work well enough together, 2 — sometimes satisfied, but not consistently, 1 — not satisfied with how the team works. Collect the notes and build a histogram on the flipchart. Discuss the results with the group.",
        exampleIllustration: (
          <img
            src="/illustrations/satisfaction_histogram_example.svg"
            alt="Satisfaction Histogram — filled example"
            className="w-full h-auto"
          />
        ),
        exampleDownloadHref: "/illustrations/satisfaction_histogram_example.svg",
        templateIllustration: (
          <img
            src="/illustrations/satisfaction_histogram_template.svg"
            alt="Satisfaction Histogram — blank template"
            className="w-full h-auto"
          />
        ),
        templateDownloadHref: "/illustrations/satisfaction_histogram_template.svg",
      },
      {
        id: "data-5",
        title: "Niko-Niko Calendar",
        goal: "Surface how team mood shifted day by day throughout the sprint.",
        process:
          "Draw a table with team members as rows and sprint days as columns. Ask each person to fill in their row by drawing a smiley for each day: happy, neutral, or unhappy. You can also use colored markers or stickers. Once complete, look for patterns — days where everyone was down often point to specific events worth discussing. Ask the group to add a score from 1 to 5 next to their row if you want a rough average.",
        exampleIllustration: (
          <img
            src="/illustrations/niko_niko_example.svg"
            alt="Niko-Niko Calendar — filled example"
            className="w-full h-auto"
          />
        ),
        exampleDownloadHref: "/illustrations/niko_niko_example.svg",
        templateIllustration: (
          <img
            src="/illustrations/niko_niko_template.svg"
            alt="Niko-Niko Calendar — blank template"
            className="w-full h-auto"
          />
        ),
        templateDownloadHref: "/illustrations/niko_niko_template.svg",
      },
      {
        id: "data-6",
        title: "4Ls (Liked, Learned, Lacked, Longed For)",
        goal: "Get structured feedback across four dimensions instead of just good vs. bad.",
        process:
          "Create four columns: Liked (what went well), Learned (new insights or skills gained), Lacked (what was missing or insufficient), Longed For (what would have made things better). Give participants 8–10 minutes to write sticky notes for any category. Post all notes on the board, read them aloud as a group, and cluster similar items. A good option when Mad/Sad/Glad feels too familiar or too simple for the team.",
        exampleIllustration: (
          <img
            src="/illustrations/4ls_example.svg"
            alt="4Ls — filled example"
            className="w-full h-auto"
          />
        ),
        exampleDownloadHref: "/illustrations/4ls_example.svg",
        templateIllustration: (
          <img
            src="/illustrations/4ls_template.svg"
            alt="4Ls — blank template"
            className="w-full h-auto"
          />
        ),
        templateDownloadHref: "/illustrations/4ls_template.svg",
      },
      {
        id: "data-7",
        title: "Emotions Graph",
        goal: "See how each person's motivation and energy moved across the sprint, not just where it ended up.",
        process:
          "Draw a timeline on the flipchart with a vertical axis from low to high. Ask each participant to draw their own continuous line showing how their motivation shifted over the sprint. Each person draws their own line. Once everyone is done, compare the curves and discuss what caused the peaks and dips. This gives a more personal and nuanced picture than aggregated data.",
        exampleIllustration: (
          <img
            src="/illustrations/emotions_graph_example.svg"
            alt="Emotions Graph — filled example"
            className="w-full h-auto"
          />
        ),
        exampleDownloadHref: "/illustrations/emotions_graph_example.svg",
        templateIllustration: (
          <img
            src="/illustrations/emotions_graph_template.svg"
            alt="Emotions Graph — blank template"
            className="w-full h-auto"
          />
        ),
        templateDownloadHref: "/illustrations/emotions_graph_template.svg",
      },
      {
        id: "data-8",
        title: "Pair Interview",
        goal: "Surface deeper insights by giving people space to think and talk before sharing with the group.",
        process:
          "Set the topic for the retro. Split into pairs and give each pair 5–8 minutes to interview each other — one person asks questions, the other answers, then they switch. The point is that one person only asks and listens, not both talking at once. After the interviews, ask each participant to write their key takeaways on sticky notes and post them on the board. Good for teams that tend to go shallow in open group discussions.",
      },
    ],
  },

  // ── 3. Idea Generation ─────────────────────────────────────────────────────
  {
    id: "idea-generation",
    number: 3,
    name: "Idea Generation",
    color: "#dc2626",       // red-600
    glowColor: "#dc262650",
    cards: [
      {
        id: "ideas-1",
        title: "Brainstorm",
        goal: "Generate as many ideas as possible before evaluating any of them.",
        process:
          "Explain the rules: quantity over quality, no criticism, no discussion. Write every idea on the flipchart. Run it in one of three ways: everyone speaks freely, each person shares one idea per round and can pass, or everyone writes silently for 5 minutes first and then shares. Pick the format based on how vocal your group tends to be.",
      },
      {
        id: "ideas-2",
        title: "Fishbone",
        goal: "Find the root causes behind a problem, not just the symptoms.",
        process:
          "Draw a fishbone on the flipchart. The head is the problem you are discussing. The bones are categories of contributing factors: what, where, who, why, when. Ask the group to add factors to each bone. Use follow-up questions like \"what else contributes to this?\" to go deeper. You can use sticky notes instead of writing directly on the flipchart.",
        exampleIllustration: (
          <img
            src="/illustrations/fishbone_example.svg"
            alt="Fishbone — filled example"
            className="w-full h-auto"
          />
        ),
        exampleDownloadHref: "/illustrations/fishbone_example.svg",
        templateIllustration: (
          <img
            src="/illustrations/fishbone_template.svg"
            alt="Fishbone — blank template"
            className="w-full h-auto"
          />
        ),
        templateDownloadHref: "/illustrations/fishbone_template.svg",
      },
      {
        id: "ideas-3",
        title: "Five Why's",
        goal: "Get past surface-level causes and find what is actually driving a problem.",
        process:
          "Pick one problem and ask the group \"why does this happen?\" Write the answer, then ask \"why?\" again. Keep going until the group agrees you have found the root cause. Five rounds is usually enough, though sometimes you need more or fewer. Watch out for answers that blame individuals — redirect toward process and system factors. Can also be done in pairs.",
        exampleIllustration: (
          <img
            src="/illustrations/five_whys_example.svg"
            alt="Five Why's — filled example"
            className="w-full h-auto"
          />
        ),
        exampleDownloadHref: "/illustrations/five_whys_example.svg",
      },
      {
        id: "ideas-4",
        title: "How Might We (HMW)",
        goal: "Shift the team from listing problems to thinking about solutions.",
        process:
          "Take the main themes from data gathering and turn each one into a \"How might we...\" question. For example: \"How might we reduce the number of surprises during QA?\" Give participants 8 minutes to write as many solution ideas as possible for each question. Collect all responses and pick the most promising ones to take into action planning.",
      },
      {
        id: "ideas-5",
        title: "Learning Matrix",
        goal: "Quickly analyze and generate ideas when there is not much time left in the session.",
        process:
          "Draw four sections on the flipchart: things that went well, things to do differently, new information, and things to appreciate. Ask participants to write sticky notes and place them in the right section. Use this when the data gathering phase already took a lot of time and you need to move toward insights and actions quickly.",
        exampleIllustration: (
          <img
            src="/illustrations/learning_matrix_example.svg"
            alt="Learning Matrix — filled example"
            className="w-full h-auto"
          />
        ),
        exampleDownloadHref: "/illustrations/learning_matrix_example.svg",
        templateIllustration: (
          <img
            src="/illustrations/learning_matrix_template.svg"
            alt="Learning Matrix — blank template"
            className="w-full h-auto"
          />
        ),
        templateDownloadHref: "/illustrations/learning_matrix_template.svg",
      },
      {
        id: "ideas-6",
        title: "World Cafe",
        goal: "Run a retrospective with a larger group without losing the quality of discussion.",
        process:
          "Split participants into groups of 4–5 and seat each group at a separate table. Each table works on one problem for 15–20 minutes. At the end of each round, one person stays at the table to summarize the discussion for the next group, and everyone else moves to a different table. Run 3–5 rounds. At the end, each table representative presents their summary to the full group. You can use the Consent Protocol to decide which solutions to keep.",
        exampleIllustration: (
          <img
            src="/illustrations/world_cafe_example.svg"
            alt="World Cafe — filled example"
            className="w-full h-auto"
          />
        ),
        exampleDownloadHref: "/illustrations/world_cafe_example.svg",
      },
      {
        id: "ideas-7",
        title: "Triple Nickels",
        goal: "Collect a large number of ideas while building on each other's thinking.",
        process:
          "Split into small groups of 2–4. Each person writes ideas on a sheet of paper for 5 minutes, then passes it to the person on their right. The next person reads the ideas and adds new ones inspired by what they see. Keep passing until each sheet returns to its original author. Works well when the group tends to anchor on the first ideas shared out loud.",
      },
      {
        id: "ideas-8",
        title: "Root Cause Diagram",
        goal: "Map out the causes behind a problem and understand how they connect to each other.",
        process:
          "Write the problem on a sticky note and place it on the board. Ask the group to build a diagram of sticky notes and arrows showing causes and effects. Each node is a symptom or cause, each arrow shows either a cause-and-effect relationship or explains why something is a problem. Focus on connections between causes, not just listing them individually.",
        exampleIllustration: (
          <img
            src="/illustrations/root_cause_example.svg"
            alt="Root Cause Diagram — filled example"
            className="w-full h-auto"
          />
        ),
        exampleDownloadHref: "/illustrations/root_cause_example.svg",
        templateIllustration: (
          <img
            src="/illustrations/root_cause_template.svg"
            alt="Root Cause Diagram — blank template"
            className="w-full h-auto"
          />
        ),
        templateDownloadHref: "/illustrations/root_cause_template.svg",
      },
    ],
  },

  // ── 4. Action Planning ─────────────────────────────────────────────────────
  {
    id: "action-planning",
    number: 4,
    name: "Action Planning",
    color: "#16a34a",       // green-600
    glowColor: "#16a34a50",
    cards: [
      {
        id: "action-1",
        title: "SMART Action Items",
        goal: "Turn the best ideas into concrete commitments that someone actually owns.",
        process:
          "Take the top ideas from the previous phase. For each one, define a SMART action: Specific (what exactly will happen?), Measurable (how will you know it's done?), Assignable (who owns it?), Realistic (can it be done in one sprint?), Time-bound (by when?). Write each action on a card with the owner and due date. Aim for 2–4 actions maximum. A short list that gets done beats a long one that gets ignored.",
      },
      {
        id: "action-2",
        title: "Start / Stop / Continue",
        goal: "Organize the team's decisions into three clear categories that are easy to remember and act on.",
        process:
          "Draw three columns: Start (new practices to adopt), Stop (things that are actively hurting the team), Continue (things working well that should be protected). Using the ideas already generated, place each one into the right column. For everything in Start and Stop, assign an owner and a target date. Go through the Continue list to acknowledge what the team is doing well.",
      },
      {
        id: "action-3",
        title: "Experiment Canvas",
        goal: "Frame improvements as small experiments rather than permanent changes, so the team feels safe trying new things.",
        process:
          "For each proposed improvement, fill in a simple card: Hypothesis (we believe that... will result in... because...), Action (the specific change to make), Duration (how long to try it), Success Metric (how to measure impact), Review Date (when to assess results). This takes the pressure off committing to big changes and makes it easier to iterate.",
      },
      {
        id: "action-4",
        title: "Dot Voting",
        goal: "Quickly prioritize a list of ideas when there are more options than the team can act on.",
        process:
          "Write all ideas on the flipchart. Each participant gets N dots to place next to the ideas they find most important (3 to 10 dots depending on group size). Multiple dots can go on the same idea. Ask everyone to pick their ideas before approaching the board to reduce influence from others. Count the dots and write the totals. The ideas with the most dots go into action planning.",
        exampleIllustration: (
          <img
            src="/illustrations/dot_voting_example.svg"
            alt="Dot Voting — filled example"
            className="w-full h-auto"
          />
        ),
        exampleDownloadHref: "/illustrations/dot_voting_example.svg",
      },
      {
        id: "action-5",
        title: "Consent Protocol",
        goal: "Reach a quick consensus on the action plan without lengthy debate.",
        process:
          "Once the action plan is written, run a consent check. On the count of three, everyone votes with their thumb: up means \"I support this,\" sideways means \"I can live with it and will do my part,\" down means \"I actively object.\" Consensus is reached if everyone shows up or sideways. If someone objects, ask what they propose instead and run the vote again.",
      },
      {
        id: "action-6",
        title: "Screening Matrix",
        goal: "Choose between several competing solutions when the team cannot agree on one.",
        process:
          "Write the list of requirements on the left side of a table. Each column is one of the proposed solutions. For each cell, mark plus if the solution meets the requirement well, or minus if it does not. Discuss the results. If no solution clearly wins, consider whether a hybrid combining the strengths of several options is possible. Variant: use scores from 1 to 5 instead of plus and minus, then sum each column.",
        exampleIllustration: (
          <img
            src="/illustrations/screening_matrix_example.svg"
            alt="Screening Matrix — filled example"
            className="w-full h-auto"
          />
        ),
        exampleDownloadHref: "/illustrations/screening_matrix_example.svg",
        templateIllustration: (
          <img
            src="/illustrations/screening_matrix_template.svg"
            alt="Screening Matrix — blank template"
            className="w-full h-auto"
          />
        ),
        templateDownloadHref: "/illustrations/screening_matrix_template.svg",
      },
    ],
  },

  // ── 5. Closing ─────────────────────────────────────────────────────────────
  {
    id: "closing",
    number: 5,
    name: "Closing",
    color: "#0284c7",       // sky-600
    glowColor: "#0284c750",
    cards: [
      {
        id: "closing-1",
        title: "ROTI (Return on Time Invested)",
        goal: "Find out whether the team felt the session was worth their time.",
        process:
          "Ask everyone to rate the retro on a scale of 1 to 5. 1 means \"I wasted my time,\" 5 means \"best use of my time today.\" Collect votes anonymously if possible, then build a quick histogram. For any score of 1 or 2, ask if anyone wants to share what they were hoping to get but did not. For scores of 4 or 5, ask what worked well. Use the results to adjust your approach for the next session.",
      },
      {
        id: "closing-2",
        title: "Appreciation Round",
        goal: "Close the session on a human note and give people a chance to acknowledge each other.",
        process:
          "Go around the room and invite each person to share one appreciation directed at a specific colleague. It should be concrete and about something that happened during the sprint, not a generic compliment. For example: \"Thanks for staying late to unblock the deployment\" rather than \"Thanks for being great.\" Participation is encouraged but not required. The facilitator goes first to set the tone.",
      },
      {
        id: "closing-3",
        title: "One Word Takeaway",
        goal: "Give everyone a moment to reflect and close the session with a shared sense of what it meant.",
        process:
          "Ask each person to share one word that captures their main takeaway or how they feel now that the session is done. Words can be thematic like \"clarity\" or \"focus,\" or emotional like \"relieved\" or \"motivated.\" Go around once. After everyone has shared, briefly note any common threads you heard. Works especially well as a bookend if you opened with One Word Retrospective or Weather Report.",
      },
      {
        id: "closing-4",
        title: "Helped, Hindered, Hypothesis",
        goal: "Collect feedback from the group on how the retrospective itself went.",
        process:
          "Draw three areas on the flipchart: what helped the retro work, what got in the way, and what to try differently next time. Ask participants to write their thoughts on sticky notes and place them in the right area. This gives you direct input on how to run better retrospectives, coming from the people who just sat through one.",
      },
      {
        id: "closing-5",
        title: "Retro of Retro",
        goal: "Improve the retrospective format itself, not just the sprint.",
        process:
          "Discuss with the group what worked well in this retro and what to change next time. What activities landed well? What felt like a waste of time? What would they want more or less of? Keep it short, 5–10 minutes. If it is a regular retro, make sure to actually follow up on the suggestions at the next session.",
      },
    ],
  },
];

// ─── IllustrationSlot ──────────────────────────────────────────────────────────
// Wraps a label + bordered box around any illustration ReactNode.
// Hides the entire slot (label included) when an <img> child fails to load.

interface IllustrationSlotProps {
  label: string;
  children: React.ReactNode;
  /** If provided, a download icon link is shown next to the label */
  downloadHref?: string;
}

function IllustrationSlot({ label, children, downloadHref }: IllustrationSlotProps) {
  const [visible, setVisible] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hide slot when image fails to load
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const imgs = el.querySelectorAll<HTMLImageElement>("img");
    if (imgs.length === 0) return;

    const handleError = () => setVisible(false);

    imgs.forEach((img) => {
      img.addEventListener("error", handleError);
      if (img.complete && img.naturalWidth === 0) setVisible(false);
    });

    return () => imgs.forEach((img) => img.removeEventListener("error", handleError));
  }, [children]);

  // Close lightbox on Escape
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen]);

  // Resolve src/alt from the rendered <img> inside the slot
  const getLightboxImg = () => {
    const img = containerRef.current?.querySelector<HTMLImageElement>("img");
    return { src: img?.src ?? downloadHref ?? "", alt: img?.alt ?? label };
  };

  if (!visible) return null;

  const { src: lbSrc, alt: lbAlt } = getLightboxImg();

  return (
    <>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          {downloadHref && (
            <a
              href={downloadHref}
              download
              title="Download"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`Download ${label}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
        {/* Clickable image container — opens lightbox */}
        <div
          ref={containerRef}
          className="mt-1 rounded-lg border border-border bg-background p-2 overflow-hidden cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
          title="Click to enlarge"
        >
          {children}
        </div>
      </div>

      {/* Lightbox overlay — rendered via portal so it escapes card overflow */}
      {lightboxOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
            onClick={() => setLightboxOpen(false)}
            aria-modal="true"
            role="dialog"
            aria-label={`${label} enlarged view`}
          >
            {/* Close button — top-right corner */}
            <button
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={lbSrc}
              alt={lbAlt}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body
        )}
    </>
  );
}

// ─── Stage Carousel Component ──────────────────────────────────────────────────

interface StageCarouselProps {
  stage: RetroStage;
  selectedCardId: string | null;
  onSelect: (cardId: string | null) => void;
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

function StageCarousel({ stage, selectedCardId, onSelect, currentIndex, onIndexChange }: StageCarouselProps) {
  const card = stage.cards[currentIndex];
  const isSelected = selectedCardId === card.id;
  const total = stage.cards.length;

  const goBack = () => onIndexChange(currentIndex === 0 ? total - 1 : currentIndex - 1);
  const goForward = () => onIndexChange(currentIndex === total - 1 ? 0 : currentIndex + 1);

  const handleToggle = () => {
    onSelect(isSelected ? null : card.id);
  };

  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-3">
        <span
          className="flex items-center justify-center w-7 h-7 rounded-full text-white text-sm font-bold flex-shrink-0"
          style={{ backgroundColor: stage.color }}
        >
          {stage.number}
        </span>
        <h2 className="text-lg font-semibold text-foreground">{stage.name}</h2>
      </div>

      {/* Carousel row: arrow + card + arrow */}
      <div className="flex items-start gap-3">
        {/* Left arrow — anchored at fixed top offset so it doesn't jump with card height */}
        <button
          onClick={goBack}
          aria-label="Previous card"
          className="flex-shrink-0 w-9 h-9 mt-4 flex items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Card */}
        <div
          className="flex-1 rounded-lg bg-card border transition-all duration-200 overflow-hidden"
          style={{
            borderLeftWidth: "4px",
            borderLeftColor: stage.color,
            boxShadow: isSelected
              ? `0 0 0 3px ${stage.glowColor}, 0 1px 4px rgba(0,0,0,0.06)`
              : "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          {/* Card inner — auto height, no scroll */}
          <div className="p-5 flex flex-col gap-3">
            {/* Title */}
            <p className="font-bold text-base text-foreground leading-snug">
              {card.title}
            </p>

            {/* Goal */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Goal
              </span>
              <p className="mt-1 text-sm text-foreground leading-relaxed">
                {card.goal}
              </p>
            </div>

            {/* Process */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Process
              </span>
              <p className="mt-1 text-sm text-foreground leading-relaxed">
                {card.process}
              </p>
            </div>

            {/* Illustrations — IllustrationSlot hides itself on image load error */}
            {(card.exampleIllustration || card.templateIllustration) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {card.exampleIllustration && (
                  <IllustrationSlot label="Example" downloadHref={card.exampleDownloadHref}>
                    {card.exampleIllustration}
                  </IllustrationSlot>
                )}
                {card.templateIllustration && (
                  <IllustrationSlot label="Template" downloadHref={card.templateDownloadHref}>
                    {card.templateIllustration}
                  </IllustrationSlot>
                )}
              </div>
            )}
          </div>

          {/* Card footer: counter + select button */}
          <div
            className="flex items-center justify-between px-5 py-2 border-t"
            style={{ borderTopColor: "hsl(var(--border))" }}
          >
            {/* Counter */}
            <span className="text-xs text-muted-foreground tabular-nums">
              {currentIndex + 1} / {total}
            </span>

            {/* Select toggle */}
            <Button
              size="sm"
              variant={isSelected ? "default" : "outline"}
              onClick={handleToggle}
              className="text-xs h-7 px-3 gap-1"
              style={
                isSelected
                  ? { backgroundColor: stage.color, borderColor: stage.color }
                  : {}
              }
            >
              {isSelected && <Check className="w-3 h-3" />}
              {isSelected ? "Selected" : "Select for retro"}
            </Button>
          </div>
        </div>

        {/* Right arrow — anchored at fixed top offset */}
        <button
          onClick={goForward}
          aria-label="Next card"
          className="flex-shrink-0 w-9 h-9 mt-4 flex items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function RetrospectiveBuilder() {
  useSEO({
    title: "Retrospective Builder — Agile Retro Activity Planner — PM-Tools",
    description:
      "Browse and select activities for each retrospective stage: Opening, Data Gathering, Idea Generation, Action Planning, and Closing. Mix, match, and copy your plan.",
    path: "/retrospective-builder",
  });

  const { toast } = useToast();

  // selectedCards: stageId → cardId | null
  const [selectedCards, setSelectedCards] = useState<Record<string, string | null>>(
    () => Object.fromEntries(STAGES.map((s) => [s.id, null]))
  );

  // carouselIndices: stageId → current card index (lifted so randomize can control it)
  const [carouselIndices, setCarouselIndices] = useState<Record<string, number>>(
    () => Object.fromEntries(STAGES.map((s) => [s.id, 0]))
  );

  const handleSelect = (stageId: string, cardId: string | null) => {
    setSelectedCards((prev) => ({ ...prev, [stageId]: cardId }));
  };

  const handleIndexChange = (stageId: string, index: number) => {
    setCarouselIndices((prev) => ({ ...prev, [stageId]: index }));
  };

  const handleRandomize = () => {
    const newSelected: Record<string, string | null> = {};
    const newIndices: Record<string, number> = {};
    STAGES.forEach((stage) => {
      const i = Math.floor(Math.random() * stage.cards.length);
      newSelected[stage.id] = stage.cards[i].id;
      newIndices[stage.id] = i;
    });
    setSelectedCards(newSelected);
    setCarouselIndices(newIndices);
  };

  // Build summary rows
  const summaryRows = STAGES.map((stage) => {
    const cardId = selectedCards[stage.id];
    const card = cardId ? stage.cards.find((c) => c.id === cardId) : null;
    return { stage, title: card?.title ?? null };
  });

  const handleCopyPlan = () => {
    const separator = "─".repeat(40);
    const sections: string[] = ["Retrospective Plan", separator, ""];

    summaryRows.forEach(({ stage, title }) => {
      if (title) {
        const cardId = selectedCards[stage.id];
        const card = stage.cards.find((c) => c.id === cardId)!;
        sections.push(`${stage.number}. ${stage.name} — ${card.title}`);
        sections.push(`Goal: ${card.goal}`);
        sections.push(`Process: ${card.process}`);
        sections.push("");
      } else {
        sections.push(`${stage.number}. ${stage.name} — (not selected)`);
        sections.push("");
      }
    });

    const text = sections.join("\n");

    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({ title: "Copied!", description: "Retro plan copied to clipboard." });
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Please copy the plan manually.",
          variant: "destructive",
        });
      });
  };

  const selectedCount = summaryRows.filter((r) => r.title !== null).length;

  return (
    <div className="flex flex-col bg-background pb-14">
      <Header />

      <main>
          <div className="container mx-auto px-6 max-w-4xl pt-4 pb-4">
          {/* Randomize button — padded to align with card edges (skipping arrow width + gap) */}
          <div className="flex justify-end mb-1 pl-12 pr-12">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRandomize}
              className="flex items-center gap-2"
            >
              <Dices className="w-4 h-4" />
              Randomize
            </Button>
          </div>

          {/* Carousels */}
          {STAGES.map((stage) => (
            <StageCarousel
              key={stage.id}
              stage={stage}
              selectedCardId={selectedCards[stage.id]}
              onSelect={(cardId) => handleSelect(stage.id, cardId)}
              currentIndex={carouselIndices[stage.id]}
              onIndexChange={(i) => handleIndexChange(stage.id, i)}
            />
          ))}
        </div>
      </main>

      <Footer />

      {/* ── Sticky Summary Panel ─────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t shadow-lg">
          <div className="container mx-auto px-6 max-w-4xl py-3">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Summary rows */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-5 gap-x-3 gap-y-2 min-w-0">
              {summaryRows.map(({ stage, title }) => (
                <div key={stage.id} className="flex flex-col min-w-0">
                  {/* Stage name row */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span
                      className="text-xs font-semibold truncate leading-tight"
                      style={{ color: stage.color }}
                    >
                      {stage.name}
                    </span>
                  </div>
                  {/* Selected activity title */}
                  <span className="text-xs truncate pl-3.5 leading-tight">
                    {title ? (
                      <span className="font-medium text-foreground">{title}</span>
                    ) : (
                      <span className="text-muted-foreground italic">—</span>
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* Copy button */}
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyPlan}
              disabled={selectedCount === 0}
              className="flex items-center gap-2 flex-shrink-0"
            >
              <ClipboardCopy className="w-4 h-4" />
              Copy plan
              {selectedCount > 0 && (
                <span className="ml-1 text-xs text-muted-foreground">
                  ({selectedCount}/{STAGES.length})
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
