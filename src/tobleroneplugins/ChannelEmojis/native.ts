export async function GenerateResponse(_, props)
{
    const { data } = JSON.parse(props);
    const response = await fetch('http://localhost:11434/api/chat', 
    {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        model: "llama2-uncensored",
        messages: 
        [
            {
                role: "system",
                content: 
                `
                    When prompted, determine a unicode emoji relevant to the context provided. Ensure your response only contains a single emoji, with no additional dialogue. Avoid human/face emojis    
                `
            },
            {
                role: "user",
                content: data
            }
        ],
        stream: false
        })
    }).then(e => e.json());
    
    console.log(response);

    return response;
}
