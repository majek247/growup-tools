import SchemaStudio, {
  field,
  address,
  identifier,
  required,
  date,
} from "./SchemaStudio";
const groups = [
  {
    title: "Video details",
    fields: [
      field("name", "Video title *"),
      field("description", "Description", "textarea"),
      field("page", "Watch page URL *", "url"),
      field("thumb", "Thumbnail image URL *", "url"),
      field("uploaded", "Upload timestamp * (ISO date, time and UTC offset)"),
    ],
  },
  {
    title: "Playback",
    fields: [
      field("duration", "Running time * (m:ss or h:mm:ss)"),
      field("file", "Direct video file URL", "url"),
      field("embed", "Embeddable player URL", "url"),
    ],
  },
];
const example = {
  name: "Cedar Analytics product walkthrough",
  description: "See how to build and export a pipeline report.",
  page: "https://example.com/watch/walkthrough",
  thumb: "https://example.com/images/walkthrough.jpg",
  uploaded: "2026-01-12T09:00:00+01:00",
  duration: "04:35",
  embed: "https://player.example.com/embed/cedar-demo",
};
export const faqs = [
  {
    question: "Which URL goes in each field?",
    answer:
      "The watch page is where a visitor watches the video. The player URL opens the embeddable player. A direct file URL points to the actual video bytes. Supply whichever playback URLs you have.",
  },
  {
    question: "How do I enter a long recording?",
    answer:
      "Enter hours, minutes and seconds, for example 1:02:09. The generator converts that to PT1H2M9S.",
  },
  {
    question: "How should I enter the upload time?",
    answer:
      "Include the time and its UTC offset, for example 2026-01-12T09:00:00+01:00. Use Z when the source timestamp is in UTC.",
  },
];

export function build(v) {
  const url = address(required(v.page, "the watch page URL"), "watch page");
  const time = required(v.uploaded, "the upload timestamp");
  if (
    !/^\d{4}-\d\d-\d\dT(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:Z|[+-](?:0\d|1[0-4]):[0-5]\d)$/.test(
      time,
    ) ||
    !Number.isFinite(Date.parse(time))
  )
    throw Error(
      "Enter an ISO upload time with a timezone, such as 2026-01-12T09:00:00+01:00.",
    );
  date(time.slice(0, 10), "upload date");
  const raw = required(v.duration, "the running time");
  if (!/^(?:\d+:[0-5]\d:[0-5]\d|\d+:[0-5]\d)$/.test(raw))
    throw Error("Use m:ss or h:mm:ss for the running time.");
  const total = raw.split(":").reduce((n, part) => 60 * n + Number(part), 0);
  if (!Number.isSafeInteger(total) || !total)
    throw Error("Enter a positive video duration.");
  const h = Math.floor(total / 3600),
    m = Math.floor((total % 3600) / 60),
    s = total % 60;
  const duration =
    "PT" + (h ? h + "H" : "") + (m ? m + "M" : "") + (s ? s + "S" : "");
  const contentUrl = address(v.file, "direct video file"),
    embedUrl = address(v.embed, "player");
  if (!contentUrl && !embedUrl)
    throw Error("Add a video file URL or an embeddable player URL.");
  return {
    node: {
      "@type": "VideoObject",
      "@id": identifier(url, "video"),
      url,
      name: required(v.name, "a video title"),
      description: v.description.trim() || undefined,
      thumbnailUrl: address(
        required(v.thumb, "the thumbnail URL"),
        "thumbnail",
      ),
      uploadDate: time,
      duration,
      contentUrl,
      embedUrl,
    },
  };
}
export default function VideoSchemaGenerator() {
  return (
    <SchemaStudio
      name="Video"
      groups={groups}
      example={example}
      build={build}
      guide="video"
    />
  );
}
