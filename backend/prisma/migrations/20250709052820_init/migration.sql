-- CreateTable
CREATE TABLE "Threat" (
    "id" SERIAL NOT NULL,
    "threatCategory" TEXT NOT NULL,
    "iocs" TEXT NOT NULL,
    "threatActor" TEXT NOT NULL,
    "attackVector" TEXT NOT NULL,
    "geographicalLocation" TEXT NOT NULL,
    "sentimentInForums" TEXT NOT NULL,
    "severityScore" DOUBLE PRECISION NOT NULL,
    "predictedThreatCategory" TEXT NOT NULL,
    "suggestedDefenseMechanism" TEXT NOT NULL,
    "riskLevelPrediction" TEXT NOT NULL,
    "cleanedText" TEXT NOT NULL,
    "keywordExtraction" TEXT NOT NULL,
    "namedEntities" TEXT NOT NULL,
    "topicModelingLabels" TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Threat_pkey" PRIMARY KEY ("id")
);
