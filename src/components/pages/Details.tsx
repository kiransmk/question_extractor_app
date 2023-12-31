import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Questions } from "../../types/collections";
import Card from "../Card";
import formatTimestamp from "../../utils/formatTimestamp";
import { QuestionType, getExtraction } from "../../services/questions";

const DATETIME_FORMAT = "MM/DD/YY - HH:mm";

const Details = () => {
  const { id } = useParams();
  const [extraction, setExtraction] = useState<Questions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchExtraction(id);
    }
  }, [id]);

  async function fetchExtraction(id: string) {
    try {
      const { data, error } = await getExtraction(id);
      if (error) throw error;
      setExtraction(data?.[0] ?? null);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching questions:", error);
      setLoading(false);
    }
  }

  const renderCardContent = (question: string, count: number) => {
    return (
      <div className="p-4">
        {count > 1 ? "*" : ""}
        {question}
        {count > 1 ? ` (${count})` : ""}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full md:max-w-2xl m-auto text-gray-700 p-10">
      {loading ? (
        <p>Loading...</p>
      ) : (
        extraction && (
          <>
            <div className="flex mb-5">
              <h4 className="text-xl">
                {formatTimestamp(extraction.inserted_at, DATETIME_FORMAT)}
              </h4>
            </div>
            <div className="flex flex-col justify-start space-y-4">
              {extraction.questions.map((q, index) => {
                const { question, count } = q as QuestionType;
                return (
                  <Card key={index}>{renderCardContent(question, count)}</Card>
                );
              })}
            </div>
          </>
        )
      )}
    </div>
  );
};

export default Details;
