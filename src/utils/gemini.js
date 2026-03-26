import axios from "axios";
import config from "../Config/config.js";

const promptGemini = async (prompt) => {
  const response = await axios.post(
    config.gemini.url,
    {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    },
    {
      headers: {
        "x-goog-api-key": config.gemini.api_key,
      },
    },
  );
  return response.data.candidates[0].content.parts[0].text;
};

export default promptGemini;
