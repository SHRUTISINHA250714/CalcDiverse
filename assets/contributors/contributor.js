const cont = document.getElementById("contributor");
const owner = "Rakesh9100";
const repoName = "CalcDiverse";

async function fetchContributors(pageNumber) {
    const apiUrl = "https://script.googleusercontent.com/macros/echo?user_content_key=HIngl5N6XqT87RP5_NGfOvh4Owd0vsFxGl4j7WfN5JA7XmZ3wfLP6Lm9KtE8MvYr-xqtib3jFCNoJ3gLd--RXPTM6yeCqYRMm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnJlUuZlL1ANkgTfzluynVq_ujwIhHMAx6EPfzKkWJ1uCshAjBuwXySyQgwTqiBx63rp_lIW_4lqd8qNYusW-W_j7amvZZ0XS2Q&lib=MVYp2QNGGJIwIlwc0BFDww2ojRkgaZCOe";

    async function getkey() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            return data.apik[0].apikey;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    const token = await getkey();
    const perPage = 100;
    const url = `https://api.github.com/repos/${owner}/${repoName}/contributors?page=${pageNumber}&per_page=${perPage}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error(
            `Failed to fetch contributors data. Status code: ${response.status}`
        );
    }

    const contributorsData = await response.json();

    return contributorsData;
}

// Function to fetch all contributors
async function fetchAllContributors() {
    // const loading = document.getElementById("grid");
    // if (loading) loading.remove(loading.firstChild);
    let allContributors = [];
    let pageNumber = 1;

    try {
        while (true) {
            const contributorsData = await fetchContributors(pageNumber);
            if (contributorsData.length === 0) {
                break;
            }
            allContributors = allContributors.concat(contributorsData);
            pageNumber++;
        }
        allContributors.forEach((contributor) => {
            const loading = document.getElementById("grid");
            if (loading) loading.remove(loading.firstChild);
            if (contributor.login === owner) {
                return;
            }

            const contributorCard = document.createElement("div");
            contributorCard.classList.add("contributor-card");

            const avatarImg = document.createElement("img");
            avatarImg.src = contributor.avatar_url;
            avatarImg.alt = `${contributor.login}'s Picture`;

            const loginLink = document.createElement("a");
            loginLink.href = contributor.html_url;
            loginLink.target = "_blank";
            loginLink.appendChild(avatarImg);

            contributorCard.appendChild(loginLink);

            cont.appendChild(contributorCard);
        });
    } catch (error) {
        console.error(error);
    }
}

fetchAllContributors();