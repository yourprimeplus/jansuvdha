/* =========================================
   JanSuvidha - Smart User Profile
   Saves only basic preferences locally
========================================= */

const JanProfile = {

    storageKey: "jansuvdha_profile",

    fields: [
        "name",
        "state",
        "age",
        "education",
        "occupation",
        "category",
        "userType"
    ],


    /* -----------------------------------------
       Get Saved Profile
    ----------------------------------------- */

    get() {

        try {

            const saved =
                localStorage.getItem(
                    this.storageKey
                );

            if(!saved) {
                return null;
            }

            return JSON.parse(saved);

        } catch(error) {

            console.error(
                "Profile read error:",
                error
            );

            return null;
        }

    },


    /* -----------------------------------------
       Save Profile
    ----------------------------------------- */

    save(profile) {

        const cleanProfile = {};

        this.fields.forEach(field => {

            if(
                profile[field] !== undefined &&
                profile[field] !== null
            ){

                cleanProfile[field] =
                    String(profile[field]).trim();

            }

        });


        localStorage.setItem(
            this.storageKey,
            JSON.stringify(cleanProfile)
        );


        showToast(
            "Your preferences have been saved."
        );


        this.updateUI();

    },


    /* -----------------------------------------
       Delete Profile
    ----------------------------------------- */

    clear() {

        localStorage.removeItem(
            this.storageKey
        );

        this.updateUI();

        showToast(
            "Saved preferences removed."
        );

    },


    /* -----------------------------------------
       Check Profile
    ----------------------------------------- */

    exists() {

        return this.get() !== null;

    },


    /* -----------------------------------------
       Personalized Categories
    ----------------------------------------- */

    getRecommendations() {

        const profile = this.get();

        if(!profile) {

            return [];

        }


        const recommendations = [];


        if(
            profile.userType === "student" ||
            profile.education
        ){

            recommendations.push(
                "Scholarship"
            );

            recommendations.push(
                "Education"
            );

            recommendations.push(
                "Jobs"
            );

        }


        if(
            profile.occupation === "farmer"
        ){

            recommendations.push(
                "Farmer"
            );

        }


        if(
            profile.occupation === "business"
        ){

            recommendations.push(
                "Loans"
            );

            recommendations.push(
                "Business"
            );

        }


        if(
            profile.age &&
            Number(profile.age) >= 60
        ){

            recommendations.push(
                "Pension"
            );

        }


        if(
            profile.category
        ){

            recommendations.push(
                "Scholarship"
            );

        }


        return [
            ...new Set(
                recommendations
            )
        ];

    },


    /* -----------------------------------------
       Update Profile UI
    ----------------------------------------- */

    updateUI() {

        const profile =
            this.get();


        const button =
            document.getElementById(
                "profileButton"
            );


        if(!button) {
            return;
        }


        if(profile) {

            button.innerHTML =
                "👤 " +
                escapeHTML(
                    profile.name ||
                    "My Profile"
                );

        } else {

            button.innerHTML =
                "👤 Profile";

        }

    }

};


/* =========================================
   Open Profile
========================================= */

function openProfile(){

    const existing =
        JanProfile.get();


    const modal =
        document.getElementById(
            "profileModal"
        );


    if(!modal) {
        return;
    }


    modal.style.display = "flex";


    if(existing){

        document.getElementById(
            "profileName"
        ).value =
            existing.name || "";


        document.getElementById(
            "profileState"
        ).value =
            existing.state || "";


        document.getElementById(
            "profileAge"
        ).value =
            existing.age || "";


        document.getElementById(
            "profileEducation"
        ).value =
            existing.education || "";


        document.getElementById(
            "profileOccupation"
        ).value =
            existing.occupation || "";


        document.getElementById(
            "profileCategory"
        ).value =
            existing.category || "";


        document.getElementById(
            "profileUserType"
        ).value =
            existing.userType || "";

    }

}


/* =========================================
   Close Profile
========================================= */

function closeProfile(){

    const modal =
        document.getElementById(
            "profileModal"
        );


    if(modal){

        modal.style.display =
            "none";

    }

}


/* =========================================
   Save Form
========================================= */

function saveProfile(){

    const profile = {

        name:
            document.getElementById(
                "profileName"
            ).value,

        state:
            document.getElementById(
                "profileState"
            ).value,

        age:
            document.getElementById(
                "profileAge"
            ).value,

        education:
            document.getElementById(
                "profileEducation"
            ).value,

        occupation:
            document.getElementById(
                "profileOccupation"
            ).value,

        category:
            document.getElementById(
                "profileCategory"
            ).value,

        userType:
            document.getElementById(
                "profileUserType"
            ).value

    };


    JanProfile.save(
        profile
    );


    closeProfile();

}


/* =========================================
   Remove Saved Profile
========================================= */

function removeProfile(){

    if(
        confirm(
            "Remove your saved preferences?"
        )
    ){

        JanProfile.clear();

        closeProfile();

    }

}


/* =========================================
   Initialize
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        JanProfile.updateUI();

    }
);
