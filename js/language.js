/* =========================================
   JanSuvidha - English / Hindi Language
========================================= */

const JanLanguage = {

    current:
        localStorage.getItem(
            "jansuvdha_language"
        ) || "en",


    translations: {

        en: {

            home: "Home",
            allSchemes: "All Schemes",
            jobs: "Jobs",
            education: "Education",
            scholarship: "Scholarship",
            health: "Health",
            farmer: "Farmer",
            housing: "Housing",
            loans: "Loans",
            importantLinks: "Important Links",

            explore: "Explore by Category",
            search: "Search",
            latestUpdates: "Latest Government Updates",
            trending: "Trending Schemes",
            importantGovernmentLinks:
                "Important Government Links",

            official:
                "Official Website ↗",

            live: "LIVE",

            disclaimer:
                "JanSuvidha is an independent citizen-information platform and is not an official government website."

        },


        hi: {

            home: "होम",
            allSchemes: "सभी योजनाएँ",
            jobs: "सरकारी नौकरी",
            education: "शिक्षा",
            scholarship: "छात्रवृत्ति",
            health: "स्वास्थ्य",
            farmer: "किसान",
            housing: "आवास",
            loans: "ऋण",
            importantLinks:
                "महत्वपूर्ण लिंक",

            explore:
                "श्रेणी के अनुसार खोजें",

            search:
                "खोजें",

            latestUpdates:
                "नवीनतम सरकारी अपडेट",

            trending:
                "लोकप्रिय योजनाएँ",

            importantGovernmentLinks:
                "महत्वपूर्ण सरकारी लिंक",

            official:
                "आधिकारिक वेबसाइट ↗",

            live: "लाइव",

            disclaimer:
                "JanSuvidha एक स्वतंत्र नागरिक सूचना प्लेटफॉर्म है और यह कोई आधिकारिक सरकारी वेबसाइट नहीं है।"

        }

    },


    setLanguage(language) {

        if(
            language !== "en" &&
            language !== "hi"
        ) {

            return;

        }


        this.current = language;


        localStorage.setItem(
            "jansuvdha_language",
            language
        );


        if(
            typeof JanSuvidha !==
            "undefined"
        ) {

            JanSuvidha.setLanguage(
                language
            );

        }


        this.updatePage();


        this.updateButton();

    },


    toggle() {

        this.setLanguage(
            this.current === "en"
                ? "hi"
                : "en"
        );

    },


    text(key) {

        return (
            this.translations[
                this.current
            ][key]
            ||
            this.translations.en[key]
            ||
            key
        );

    },


    updateButton() {

        const button =
            document.getElementById(
                "languageButton"
            );


        if(!button) {

            return;

        }


        button.innerText =
            this.current === "en"
                ? "हिंदी"
                : "EN";

    },


    updatePage() {

        document
            .querySelectorAll(
                "[data-lang]"
            )
            .forEach(element => {

                const key =
                    element.dataset.lang;

                if(
                    this.translations[
                        this.current
                    ][key]
                ) {

                    element.innerText =
                        this.translations[
                            this.current
                        ][key];

                }

            });


        document
            .querySelectorAll(
                "[data-lang-placeholder]"
            )
            .forEach(element => {

                const key =
                    element.dataset
                        .langPlaceholder;


                const translated =
                    this.translations[
                        this.current
                    ][key];


                if(translated) {

                    element.placeholder =
                        translated;

                }

            });

    }

};


/* =========================================
   Global Language Function
========================================= */

window.toggleJanLanguage =
function() {

    JanLanguage.toggle();

};


/* =========================================
   Initialization
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        JanLanguage.updatePage();

        JanLanguage.updateButton();

    }
);
