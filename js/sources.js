/* =========================================
   JanSuvidha - Official Sources
========================================= */

const JanSources = {

    dataURL: "./data/sources.json",

    async load() {

        try {

            const response =
                await fetch(
                    this.dataURL +
                    "?v=" +
                    Date.now(),
                    {
                        cache: "no-store"
                    }
                );

            if (!response.ok) {

                throw new Error(
                    "Sources could not be loaded"
                );

            }

            const data =
                await response.json();

            if (
                !data ||
                !Array.isArray(data.sources)
            ) {

                throw new Error(
                    "Invalid sources.json"
                );

            }

            this.render(
                data.sources
            );

            return data.sources;

        } catch (error) {

            console.error(
                "JanSuvidha Sources Error:",
                error
            );

            return [];

        }

    },


    render(sources) {

        const container =
            document.getElementById(
                "officialSourcesGrid"
            );

        if (!container) {

            return;

        }


        if (!sources.length) {

            container.innerHTML = `

                <div class="news-item">

                    Official sources
                    are temporarily unavailable.

                </div>

            `;

            return;

        }


        container.innerHTML =

            sources.map(source => {

                const name =
                    typeof JanLanguage !==
                    "undefined" &&
                    JanLanguage.current === "hi"
                        ? (
                            source.name_hi ||
                            source.name
                        )
                        : source.name;


                return `

                    <a
                        class="link-card"
                        href="${safeURL(source.url)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >

                        <div
                            class="link-icon"
                        >
                            🇮🇳
                        </div>

                        <div>

                            <strong>
                                ${escapeHTML(name)}
                            </strong>

                            <div
                                class="muted"
                            >
                                ${escapeHTML(
                                    source.category ||
                                    "Government"
                                )}
                            </div>

                            <small
                                class="muted"
                            >
                                ✓ Official Source
                            </small>

                        </div>

                    </a>

                `;

            }).join("");

    }

};


window.JanSources =
    JanSources;


document.addEventListener(
    "DOMContentLoaded",
    function() {

        JanSources.load();

    }
);
