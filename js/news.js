/* =========================================
   JanSuvidha - News System
   Loads news from data/news.json
========================================= */

const JanNews = {

    dataURL: "./data/news.json",

    storageKey: "jansuvdha_news_cache",

    maxNews: 20,

    defaultNews: [
        {
            id: "default-1",
            title: "Check official government portals for latest announcements.",
            title_hi: "नवीनतम सरकारी घोषणाओं के लिए आधिकारिक सरकारी पोर्टल देखें।",
            category: "Government",
            source: "JanSuvidha",
            date: "",
            url: "https://www.india.gov.in/"
        }
    ],

    /* -----------------------------------------
       Load News JSON
    ----------------------------------------- */

    async load() {

        try {

            const response = await fetch(
                this.dataURL + "?v=" + Date.now(),
                {
                    cache: "no-store"
                }
            );

            if (!response.ok) {

                throw new Error(
                    "News JSON could not be loaded"
                );

            }

            const data =
                await response.json();

            if (
                !data ||
                !Array.isArray(data.news)
            ) {

                throw new Error(
                    "Invalid news.json format"
                );

            }

            const news =
                this.removeDuplicates(
                    data.news
                ).slice(
                    0,
                    this.maxNews
                );

            this.saveNews(news);

            this.render();

            console.log(
                "JanSuvidha: News loaded successfully",
                news
            );

            return news;

        } catch (error) {

            console.error(
                "JanSuvidha News Error:",
                error
            );

            const cached =
                this.getCachedNews();

            if (cached.length) {

                this.render();

                return cached;

            }

            this.render(
                this.defaultNews
            );

            return this.defaultNews;

        }

    },


    /* -----------------------------------------
       Cache
    ----------------------------------------- */

    getCachedNews() {

        try {

            const saved =
                localStorage.getItem(
                    this.storageKey
                );

            if (!saved) {

                return [];

            }

            const data =
                JSON.parse(saved);

            return Array.isArray(data)
                ? data
                : [];

        } catch (error) {

            return [];

        }

    },


    saveNews(news) {

        try {

            localStorage.setItem(
                this.storageKey,
                JSON.stringify(news)
            );

        } catch (error) {

            console.error(
                "Could not save news cache:",
                error
            );

        }

    },


    /* -----------------------------------------
       Remove Duplicates
    ----------------------------------------- */

    removeDuplicates(news) {

        const seen =
            new Set();

        return news.filter(item => {

            const key =
                String(
                    item.title || ""
                )
                .trim()
                .toLowerCase();

            if (!key) {

                return false;

            }

            if (seen.has(key)) {

                return false;

            }

            seen.add(key);

            return true;

        });

    },


    /* -----------------------------------------
       Date Formatter
    ----------------------------------------- */

    formatDate(date) {

        if (!date) {

            return "";

        }

        try {

            const d =
                new Date(date);

            if (
                Number.isNaN(
                    d.getTime()
                )
            ) {

                return "";

            }

            return new Intl.DateTimeFormat(
                "en-IN",
                {
                    timeZone: "Asia/Kolkata",
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            ).format(d);

        } catch (error) {

            return "";

        }

    },


    /* -----------------------------------------
       Get Current Language
    ----------------------------------------- */

    getLanguage() {

        if (
            typeof JanLanguage !==
            "undefined"
        ) {

            return (
                JanLanguage.current ||
                "en"
            );

        }

        return "en";

    },


    /* -----------------------------------------
       Render News
    ----------------------------------------- */

    render(newsData = null) {

        const container =
            document.getElementById(
                "newsList"
            );

        if (!container) {

            return;

        }

        const news =
            Array.isArray(newsData)
                ? newsData
                : this.getCachedNews();


        if (!news.length) {

            container.innerHTML = `

                <div class="news-item">

                    <strong>
                        No latest updates available.
                    </strong>

                </div>

            `;

            return;

        }


        const language =
            this.getLanguage();


        container.innerHTML =

            news
                .slice(
                    0,
                    this.maxNews
                )
                .map(item => {

                    const title =
                        language === "hi"
                            ? (
                                item.title_hi ||
                                item.title
                            )
                            : item.title;


                    const date =
                        this.formatDate(
                            item.date
                        );


                    const category =
                        item.category ||
                        "UPDATE";


                    const source =
                        item.source ||
                        "";


                    const url =
                        item.url ||
                        "#";


                    return `

                        <div
                            class="news-item"
                            data-category="${escapeHTML(category)}"
                        >

                            <span class="live-badge">
                                ${escapeHTML(category)}
                            </span>

                            <span
                                style="
                                    flex:1;
                                    min-width:0;
                                "
                            >

                                <a
                                    href="${safeURL(url)}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style="
                                        font-weight:700;
                                        text-decoration:none;
                                    "
                                >
                                    ${escapeHTML(title)}
                                </a>

                                <br>

                                <small class="muted">

                                    ${
                                        source
                                            ? escapeHTML(source)
                                            : ""
                                    }

                                    ${
                                        date
                                            ? " • " +
                                              escapeHTML(date)
                                            : ""
                                    }

                                </small>

                            </span>

                        </div>

                    `;

                })
                .join("");

    },


    /* -----------------------------------------
       Search News
    ----------------------------------------- */

    search(keyword) {

        const news =
            this.getCachedNews();

        const query =
            String(
                keyword || ""
            )
            .trim()
            .toLowerCase();


        if (!query) {

            this.render(news);

            return news;

        }


        const results =
            news.filter(item => {

                const text = (

                    String(
                        item.title || ""
                    ) +

                    " " +

                    String(
                        item.title_hi || ""
                    ) +

                    " " +

                    String(
                        item.category || ""
                    ) +

                    " " +

                    String(
                        item.source || ""
                    )

                ).toLowerCase();


                return text.includes(query);

            });


        this.render(results);

        return results;

    },


    /* -----------------------------------------
       Category Filter
    ----------------------------------------- */

    filter(category) {

        const news =
            this.getCachedNews();


        if (
            !category ||
            category === "All"
        ) {

            this.render(news);

            return news;

        }


        const results =
            news.filter(item => {

                return String(
                    item.category || ""
                )
                .toLowerCase()
                ===
                String(category)
                    .toLowerCase();

            });


        this.render(results);

        return results;

    },


    /* -----------------------------------------
       Reset Cache
    ----------------------------------------- */

    reset() {

        localStorage.removeItem(
            this.storageKey
        );

        this.load();

    }

};


/* =========================================
   Global Object
========================================= */

window.JanNews =
    JanNews;


/* =========================================
   Start News System
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        JanNews.load();

    }
);
