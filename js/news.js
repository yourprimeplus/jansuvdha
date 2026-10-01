/* =========================================
   JanSuvidha - Government News System
   ========================================= */

const JanNews = {

    /* -----------------------------------------
       Configuration
    ----------------------------------------- */

    storageKey: "jansuvdha_news_cache",

    maxNews: 20,

    /* -----------------------------------------
       Default News
       ----------------------------------------- */

    defaultNews: [

        {
            id: "default-1",
            title: "Check official government portals for latest announcements.",
            title_hi: "नवीनतम घोषणाओं के लिए आधिकारिक सरकारी पोर्टल देखें।",
            category: "Government",
            date: "",
            source: "JanSuvidha",
            url: "#"
        },

        {
            id: "default-2",
            title: "Students should verify scholarship deadlines before applying.",
            title_hi: "आवेदन करने से पहले छात्र छात्रवृत्ति की अंतिम तिथि अवश्य जाँचें।",
            category: "Education",
            date: "",
            source: "JanSuvidha",
            url: "#"
        },

        {
            id: "default-3",
            title: "Job seekers should verify recruitment notifications from official sources.",
            title_hi: "नौकरी की सूचना हमेशा आधिकारिक स्रोत से सत्यापित करें।",
            category: "Jobs",
            date: "",
            source: "JanSuvidha",
            url: "#"
        },

        {
            id: "default-4",
            title: "Farmers can check official agriculture portals for current schemes.",
            title_hi: "किसान वर्तमान योजनाओं के लिए आधिकारिक कृषि पोर्टल देख सकते हैं।",
            category: "Farmer",
            date: "",
            source: "JanSuvidha",
            url: "#"
        }

    ],


    /* -----------------------------------------
       Get Cached News
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

            console.error(
                "News cache error:",
                error
            );

            return [];

        }

    },


    /* -----------------------------------------
       Save News
       ----------------------------------------- */

    saveNews(news) {

        if (!Array.isArray(news)) {

            return;

        }

        const cleaned =
            news
                .filter(item => item && item.title)
                .slice(0, this.maxNews);

        try {

            localStorage.setItem(
                this.storageKey,
                JSON.stringify(cleaned)
            );

        } catch (error) {

            console.error(
                "News save error:",
                error
            );

        }

    },


    /* -----------------------------------------
       Get All News
       ----------------------------------------- */

    getNews() {

        const cached =
            this.getCachedNews();

        if (cached.length) {

            return cached;

        }

        return this.defaultNews;

    },


    /* -----------------------------------------
       Add News
       ----------------------------------------- */

    addNews(item) {

        if (!item || !item.title) {

            return;

        }

        const current =
            this.getNews();

        const news = [

            item,

            ...current

        ];

        this.saveNews(news);

        this.render();

    },


    /* -----------------------------------------
       Remove Duplicate News
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
       Format Date
       ----------------------------------------- */

    formatDate(date) {

        if (!date) {

            return "";

        }

        try {

            const parsed =
                new Date(date);

            if (
                Number.isNaN(
                    parsed.getTime()
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
            ).format(parsed);

        } catch (error) {

            return "";

        }

    },


    /* -----------------------------------------
       Render News
       ----------------------------------------- */

    render() {

        const container =
            document.getElementById(
                "newsList"
            );

        if (!container) {

            return;

        }

        let news =
            this.getNews();

        news =
            this.removeDuplicates(
                news
            )
            .slice(
                0,
                this.maxNews
            );


        if (!news.length) {

            container.innerHTML = `

                <div class="news-item">

                    <span>
                        No latest updates available.
                    </span>

                </div>

            `;

            return;

        }


        const language =
            typeof JanLanguage !== "undefined"
                ? JanLanguage.current
                : "en";


        container.innerHTML =

            news.map(item => {

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


                const hasURL =
                    item.url &&
                    item.url !== "#";


                return `

                    <div class="news-item">

                        <span class="live-badge">
                            ${escapeHTML(
                                item.category ||
                                "UPDATE"
                            )}
                        </span>

                        <span style="flex:1;">

                            ${
                                hasURL
                                ? `
                                    <a
                                        href="${safeURL(item.url)}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style="
                                            font-weight:700;
                                        "
                                    >
                                        ${escapeHTML(title)}
                                    </a>
                                `
                                : `
                                    <strong>
                                        ${escapeHTML(title)}
                                    </strong>
                                `
                            }

                            ${
                                date
                                ? `
                                    <br>
                                    <small class="muted">
                                        ${escapeHTML(date)}
                                    </small>
                                `
                                : ""
                            }

                        </span>

                    </div>

                `;

            }).join("");

    },


    /* -----------------------------------------
       Filter News
       ----------------------------------------- */

    filter(category) {

        const news =
            this.getNews()
                .filter(item => {

                    return String(
                        item.category || ""
                    )
                    .toLowerCase()
                    ===
                    String(category)
                        .toLowerCase();

                });


        return news;

    },


    /* -----------------------------------------
       Reset News
       ----------------------------------------- */

    reset() {

        localStorage.removeItem(
            this.storageKey
        );

        this.render();

    }

};


/* =========================================
   Global Functions
========================================= */

window.JanNews =
    JanNews;


/* =========================================
   Initialize
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        JanNews.render();

    }
);
