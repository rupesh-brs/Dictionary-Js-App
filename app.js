document.getElementById("searchBtn").addEventListener("click", function () {
    const word = document.getElementById("word").value;
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const wordData = data[0];
                let output = `<strong></strong> ${wordData.word}<br>`;

                // Display audio
                const audioPhonetics = wordData.phonetics
                    .filter(phonetic => phonetic.audio) // Only include audio entries
                    .map(phonetic => ` 
                        <audio controls style="width: 200px;">
                            <source src="${phonetic.audio}" type="audio/mpeg">
                            Your browser does not support the audio element.
                        </audio><br>
                        <strong></strong> ${phonetic.text || ''}<br>
                    `).join('');

                output += audioPhonetics;

                // Display meanings
                wordData.meanings.forEach(meaning => {
                    output += `<strong></strong> ${meaning.partOfSpeech}<br>`;
                    if (meaning.synonyms.length > 0) {
                        output += `<strong></strong> ${meaning.synonyms.join(', ')}<br>`;
                    } else {
                        output += `<strong></strong> None<br>`;
                    }
                    output += `<strong></strong><br>`;
                    meaning.definitions.forEach(def => {
                        output += `- ${def.definition} ${def.example ? `(Example: ${def.example})` : ''}<br>`;
                    });
                    output += `<br>`;
                });

                document.getElementById("meaning").innerHTML = output;
            } else {
                document.getElementById("meaning").innerHTML = "No results found.";
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("meaning").innerHTML = "Error fetching data.";
        });
});
