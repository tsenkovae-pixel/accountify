import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Ти си експерт счетоводител с 20 години опит. Помагаш на български счетоводители с практически съвети за данъци, осигуровки, ДДС и счетоводна отчетност. Отговаряй кратко и ясно на български език."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
    });

    const reply = completion.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("OpenAI error:", error);
    return NextResponse.json(
      { error: "Грешка при обработка на заявката" },
      { status: 500 }
    );
  }
}
