import fs from "fs";
import csv from "csv-parser";
import prisma from "../prisma/client";

const csvPath = "data/cyber_threat_data.csv";

async function ingestData() {
  const records: any[] = [];

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on("data", (row) => {
      records.push({
        threatCategory: row["Threat Category"] || "",
        iocs: row["IOCs (Indicators of Compromise)"] || "",
        threatActor: row["Threat Actor"] || "",
        attackVector: row["Attack Vector"] || "",
        geographicalLocation: row["Geographical Location"] || "",
        sentimentInForums: row["Sentiment in Forums"] || "",
        severityScore: parseFloat(row["Severity Score"]) || 0,
        predictedThreatCategory: row["Predicted Threat Category"] || "",
        suggestedDefenseMechanism: row["Suggested Defense Mechanism"] || "",
        riskLevelPrediction: row["Risk Level Prediction"] || "",
        cleanedText: row["Cleaned Threat Description"] || "",
        keywordExtraction: row["Keyword Extraction"] || "",
        namedEntities: row["Named Entities (NER)"] || "",
        topicModelingLabels: row["Topic Modeling Labels"] || "",
        wordCount: parseInt(row["Word Count"]) || 0,
      });
    })
    .on("end", async () => {
      console.log(`🚀 Inserting ${records.length} records...`);
      for (const threat of records) {
        await prisma.threat.create({ data: threat });
      }
      console.log("✅ Ingestion complete");
      process.exit(0);
    });
}

ingestData().catch((e) => {
  console.error("❌ Error during ingestion:", e);
  process.exit(1);
});
