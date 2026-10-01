/* =========================================
   JanSuvidha - Main Application
========================================= */

const JanSuvidha = {

    language: localStorage.getItem("jansuvdha_language") || "en",

    data: {
        schemes: [],
        jobs: [],
        scholarships: [],
        links: []
    },

    async loadData() {

        try {

            const [
                schemes,
                jobs,
                scholarships,
                links
            ] = await Promise.all([

                fetch("./data/schemes.json")
                    .then(response => response.json()),

                fetch("./data/jobs.json")
                    .then(response => response.json()),

                fetch("./data/scholarships.json")
                    .then(response => response.json()),

                fetch("./data/links.json")
                    .then(response => response.json())

            ]);

            this.data.schemes = schemes;
            this.data.jobs = jobs;
            this.data.scholarships = scholarships;
            this.data.links = links;

            console.log(
                "JanSuvidha data loaded successfully."
            );

            console.log(
                "Schemes:",
                schemes.length
            );

            console.log(
                "Jobs:",
                jobs.length
            );

            console.log(
                "Scholarships:",
                scholarships.length
            );

            console.log(
                "Links:",
                links.length
            );

            return true;

        } catch(error) {

            console.error(
                "JanSuvidha data loading error:",
                error
            );

            return false;
        }
    },


    getAllData() {

        return [

            ...this.data.schemes,

            ...this.data.jobs,

            ...this.data.scholarships

        ];

    },


    search(query) {

        if(!query) {

            return this.getAllData();

        }

        const searchText =
            query
            .toLowerCase()
            .trim();

        return this.getAllData().filter(item => {

            const searchableText = [

                item.name,

                item.nameHi,

                item.category,

                item.categoryHi,

                item.description,

                item.descriptionHi,

                item.state

            ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

            return searchableText.includes(
                searchText
            );

        });

    },


    filterByCategory(category) {

        if(!category) {

            return this.getAllData();

        }

        return this.getAllData().filter(item =>

            item.category &&
            item.category.toLowerCase() ===
            category.toLowerCase()

        );

    },


    filterByState(state) {

        if(!state) {

            return this.getAllData();

        }

        return this.getAllData().filter(item =>

            item.state === "All India" ||
            item.state?.toLowerCase() ===
            state.toLowerCase()

        );

    },


    setLanguage(language) {

        if(
            language !== "en" &&
            language !== "hi"
        ) {

            return;

        }

        this.language = language;

        localStorage.setItem(
            "jansuvdha_language",
            language
        );

    },


    getText(item, field) {

        if(
            this.language === "hi" &&
            item[field + "Hi"]
        ) {

            return item[field + "Hi"];

        }

        return item[field] || "";

    },


    saveUserProfile(profile) {

        localStorage.setItem(

            "jansuvdha_profile",

            JSON.stringify(profile)

        );

    },


    getUserProfile() {

        try {

            const profile =
                localStorage.getItem(
                    "jansuvdha_profile"
                );

            return profile
                ? JSON.parse(profile)
                : null;

        } catch(error) {

            return null;

        }

    },


    clearUserProfile() {

        localStorage.removeItem(
            "jansuvdha_profile"
        );

    }

};


/* =========================================
   Start Application
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        const loaded =
            await JanSuvidha.loadData();

        if(loaded) {

            console.log(
                "JanSuvidha is ready."
            );

        }

    }
);
