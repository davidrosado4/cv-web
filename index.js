import {
  bio,
  skills,
  education,
  experience,
  activities,
  footer,
  publications_talks
} from "./user-data/data.js";

import { URLs } from "./user-data/urls.js";

const { gitConnected, gitRepo } = URLs;

async function fetchReposFromGit(url) {
  try {
    const response = await fetch(url);
    const items = await response.json();
    populateRepo(items, "repos");
  } catch (error) {
    throw new Error(`Error in fetching the blogs from repos: ${error}`);
  }
}

async function fetchGitConnectedData(url) {
  try {
    const response = await fetch(url);
    const { basics } = await response.json();
    // populateBlogs(items, "blogs");
    mapBasicResponse(basics);
  } catch (error) {
    throw new Error(`Error in fetching the blogs from git connected: ${error}`);
  }
}

function mapBasicResponse(basics) {
  const {
    name,
    label,
    image,
    email,
    phone,
    url,
    summary,
    profiles,
    headline,
    blog,
    yearsOfExperience,
    username,
    locationAsString,
    region,
    karma,
    id,
    followers,
    following,
    picture,
    website,
  } = basics;

  // added title of page
  window.parent.document.title = name;
}

function populateBio(items, id) {
  const bioTag = document.getElementById(id);
  items.forEach((bioItem) => {
    const p = getElement("p", null);
    p.innerHTML = bioItem;
    bioTag.append(p);
  });
}

function populateSkills(items, id) {
  const skillsTag = document.getElementById(id);
  items.forEach((item) => {
    const h3 = getElement("li", null);
    h3.innerHTML = item;

    const divProgressWrap = getElement("div", "progress-wrap");
    divProgressWrap.append(h3);

    const divAnimateBox = getElement("div", "col-md-12 animate-box");
    divAnimateBox.append(divProgressWrap);

    skillsTag.append(divAnimateBox);
  });
}

function populateActivities(items) {
  const activitiesTag = document.getElementById('activities');

  // Create a wrapper for the row
  const row = document.createElement('div');
  row.classList.add('row');  // Add Bootstrap's row class for a responsive layout

  items.forEach((item) => {
    // Create column div for each activity (use col-md-6 for 2 columns in a row)
    const activityColumn = document.createElement('div');
    activityColumn.classList.add('col-md-6');

    // Create a box for each activity (use 'animate-box' class for animation)
    const divAnimateBox = document.createElement('div');
    divAnimateBox.classList.add('animate-box');
    
    // Create a header for the activity title
    const h3 = document.createElement('h3');
    h3.innerHTML = item.title;


    // Create a div for the activity image
    const img = document.createElement('img');
    img.src = encodeURI(item.image);;
    img.alt = item.title;
    img.classList.add('activity-image');  // Add a class for styling the image if needed
    img.onload = function() {
      console.log("Image loaded successfully");
    };
    img.onerror = function() {
      console.error("Image failed to load");
    };

    // Create a div for activity details
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('activity-details');
    detailsDiv.innerHTML = item.details || "Details about this activity.";  // Fallback text if no details are provided
    
    // Append title, image, and details to the activity column
    activityColumn.appendChild(h3);
    activityColumn.appendChild(img);
    activityColumn.appendChild(detailsDiv);

    // Append the activity column to the row
    row.appendChild(activityColumn);
  });

  // Append the row to the activities container
  activitiesTag.appendChild(row);
}



function populateBlogs(items, id) {
  const projectdesign = document.getElementById(id);
  const count = 3; // Number of blogs to display

  for (let i = 0; i < count; i++) {
      // Create a wrapper for the blog card
      const blogCard = document.createElement("div");
      blogCard.className = "blog-card";
      blogCard.style = `
          display: flex;
          flex-direction: column;
          border-radius: 12px;
          padding: 16px;
          font-size: 14px;
          background: linear-gradient(135deg, rgb(0, 51, 102), rgb(0, 153, 204));
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          min-height: 150px;
          cursor: pointer;
      `;

      // Wrap the card content in an anchor tag
      const blogLink = document.createElement("a");
      blogLink.href = items[i].pdflink;
      blogLink.target = "_blank";
      blogLink.style = "text-decoration: none; color: white; display: block;"; //color title text

      blogCard.appendChild(blogLink);

      // Blog Title
      const blogTitle = document.createElement("h4");
      blogTitle.className = "blog-heading";
      blogTitle.innerHTML = items[i].title;
      blogTitle.style = "margin: 0 0 8px; font-size: 18px; font-weight: bold;";
      blogLink.appendChild(blogTitle);

      // Publish Date
      const pubDateEle = document.createElement("p");
      pubDateEle.className = "publish-date";
      pubDateEle.innerHTML = getBlogDate(items[i].pubDate);
      pubDateEle.style = "margin: 0 0 12px; font-size: 13px; color: #B0B0B0; font-weight: bold;";
      blogLink.appendChild(pubDateEle);

      // Blog Description
      const blogDescription = document.createElement("p");
      blogDescription.className = "blog-description";
      const html = items[i].abstract;
      const [, doc] = /<p>(.*?)<\/p>/g.exec(html) || [];
      blogDescription.innerHTML = doc;
      blogDescription.style = "margin: 0 0 12px; font-size: 14px; color: white;";
      blogLink.appendChild(blogDescription);

      // Magazine
      const magazine = document.createElement("p");
      magazine.className = "publish-date";
      magazine.innerHTML = items[i].magazine;
      magazine.style = "margin: 0 0 12px; font-size: 13px; color: #B0B0B0; font-weight: bold;";
      blogLink.appendChild(magazine);

      // Categories (Tags)
      const categoriesDiv = document.createElement("div");
      categoriesDiv.style = "display: flex; gap: 8px; margin-top: 13px;";

      for (const [index, category] of items[i].keywords.entries()) {
        const badge = document.createElement("span");
        
        // Check if it's the first badge
        if (index === 0) {
            badge.classList.add("badgeinit"); // Add the special class for the first badge
        } else {
            badge.classList.add("badge"); // Add the regular badge class for others
        }
    
        badge.innerHTML = category;
        badge.style = `
            font-size: 12px;
            padding: 4px 8px;
            background-color: #007acc;
            color: white;
            border-radius: 4px;
        `;
    
        categoriesDiv.appendChild(badge);
    }

      blogLink.appendChild(categoriesDiv);

      // Append the blog card to the container
      projectdesign.appendChild(blogCard);
  }
}

function populateRepo(items, id) {
  const projectdesign = document.getElementById(id);
  const count = 4; // Adjust this count based on the number of repos you want to display

  // Set up a wrapper div to hold repo cards in rows of 2
  const rowWrapper = document.createElement("div");
  rowWrapper.style =
    "display: flex; flex-wrap: wrap; gap: 16px; justify-content: space-between;";
  projectdesign.appendChild(rowWrapper);

  for (let i = 0; i < count; i++) {
    // Create elements for each repo card
    const repoCard = document.createElement("div");
    repoCard.className = "repo-card";
    repoCard.style = `
          flex: 1 0 48%;  /* Two cards in one row */
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 12px;
          padding: 16px;
          font-size: 14px;
          background: linear-gradient(135deg, rgb(0, 51, 102), rgb(0, 153, 204));
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease-in-out;
          cursor: pointer;
      `;

    // Make the card clickable by wrapping the content inside an anchor tag
    const repoLink = document.createElement("a");
    repoLink.href = `https://github.com/${items[i].author}/${items[i].name}`;
    repoLink.target = "_blank";
    repoLink.style =''
      "text-decoration: none; color: white; display: block; height: 100%;";


    repoCard.appendChild(repoLink);

    // Repository name
    const repoName = document.createElement("h4");
    repoName.className = "repo-heading";
    repoName.innerHTML = items[i].name;
    repoName.style = "margin: 0; font-size: 18px; font-weight: bold; color:white;";
    repoLink.appendChild(repoName);

    // Repository description
    const repoDescription = document.createElement("p");
    repoDescription.className = "repo-description";
    repoDescription.innerHTML = items[i].description;
    repoDescription.style = "margin-top: 8px; font-size: 14px; color: white;";
    repoLink.appendChild(repoDescription);

    // Stats row (Language, Stars, Forks)
    const statsRow = document.createElement("div");
    statsRow.style = `
          display: flex; 
          align-items: center; 
          gap: 16px; 
          margin-top: 12px; 
          font-size: 13px; 
          color: white;
      `;

    // Language
    const languageDiv = document.createElement("div");
    languageDiv.style = "display: flex; align-items: center; gap: 4px; ";
    languageDiv.innerHTML = `
          <span style="width: 8px; height: 8px; background-color: #8B4000; border-radius: 50%; display: inline-block;"></span>
          ${items[i].language}
      `;
    statsRow.appendChild(languageDiv);

    // Stars
    const starsDiv = document.createElement("div");
    starsDiv.style = "display: flex; align-items: center; gap: 4px; color:white";
    starsDiv.innerHTML = `
      <img src="https://img.icons8.com/ios-filled/16/666666/star--v1.png" 
           alt="Stars" 
           style="filter: invert(81%) sepia(80%) saturate(387%) hue-rotate(1deg) brightness(105%) contrast(104%);">
      ${items[i].stars}
    `;
  statsRow.appendChild(starsDiv);

    // Forks
    const forksDiv = document.createElement("div");
    forksDiv.style = "display: flex; align-items: center; gap: 4px;";
    forksDiv.innerHTML = `
          <img src="https://img.icons8.com/ios-filled/16/666666/code-fork.png" 
              alt="Forks"  style="filter: invert(90%) brightness(120%) grayscale(30%);">
          ${items[i].forks}
      `;
  statsRow.appendChild(forksDiv);

    repoLink.appendChild(statsRow);

    // Add the repo card to the row wrapper
    rowWrapper.appendChild(repoCard);
  }
}

function populateExp_Edu(items, id) {
  let mainContainer = document.getElementById(id);

  for (let i = 0; i < items.length; i++) {
    let spanTimelineSublabel = document.createElement("span");
    spanTimelineSublabel.className = "timeline-sublabel";
    spanTimelineSublabel.innerHTML = items[i].subtitle;
    spanTimelineSublabel.style = "font-family: cursive";

    let spanh2 = document.createElement("span");
    spanh2.innerHTML = items[i].duration;
    spanh2.style = "margin-left: 4mm; color:rgb(202, 187, 187); font-weight: bold;";

    let h2TimelineLabel = document.createElement("h2");
    h2TimelineLabel.innerHTML = items[i].title;
    h2TimelineLabel.append(spanh2);

    let divTimelineLabel = document.createElement("div");
    divTimelineLabel.className = "timeline-label";
    divTimelineLabel.append(h2TimelineLabel);
    divTimelineLabel.append(spanTimelineSublabel);

    for (let j = 0; j < items[i].details.length; j++) {
      let pTimelineText = document.createElement("p");
      pTimelineText.className = "timeline-text";
      pTimelineText.innerHTML = items[i].details[j];
      divTimelineLabel.append(pTimelineText);
    }

    let divTags = document.createElement("div");
    divTags.style = "display: flex; gap: 8px; margin-top: 13px;";
    for (let j = 0; j < items[i].tags.length; j++) {
      let spanTags = document.createElement("span");
      spanTags.className = "badge";
      spanTags.innerHTML = items[i].tags[j];
      spanTags.style = `
            font-size: 12px;
            padding: 4px 8px;
            background-color: #007acc;
            color: white;
            border-radius: 4px;
        `;
      divTags.append(spanTags);
    }
    divTimelineLabel.append(divTags);

    let iFa = document.createElement("i");
    iFa.className = "fa fa-" + items[i].icon;

    let divTimelineIcon = document.createElement("div");
    divTimelineIcon.className = "timeline-icon color-2";
    divTimelineIcon.append(iFa);

    let divTimelineEntryInner = document.createElement("div");
    divTimelineEntryInner.className = "timeline-entry-inner";
    divTimelineEntryInner.append(divTimelineIcon);
    divTimelineEntryInner.append(divTimelineLabel);

    let article = document.createElement("article");
    article.className = "timeline-entry animate-box";
    article.append(divTimelineEntryInner);

    mainContainer.append(article);
  }

  let divTimelineIcon = document.createElement("div");
  divTimelineIcon.className = "timeline-icon color-2";

  let divTimelineEntryInner = document.createElement("div");
  divTimelineEntryInner.className = "timeline-entry-inner";
  divTimelineEntryInner.append(divTimelineIcon);

  let article = document.createElement("article");
  article.className = "timeline-entry begin animate-box";
  article.append(divTimelineEntryInner);

  mainContainer.append(article);
}

function populateLinks(items, id) {
  let footer = document.getElementById(id);

  items.forEach(function (item) {
    if (item.label !== "copyright-text") {
      let span = document.createElement("span");
      span.className = "col";

      let p = document.createElement("p");
      p.className = "col-title";
      p.innerHTML = item.label;
      span.append(p);

      let nav = document.createElement("nav");
      nav.className = "col-list";

      let ul = document.createElement("ul");
      item.data.forEach(function (data) {
        let li = document.createElement("li");
        let a = document.createElement("a");
        if (data.link) {
          a.href = data.link;
          a.target = "_blank";
        }
        if (data.func) {
          a.setAttribute("onclick", data.func);
        }
        a.innerHTML = data.text;

        li.append(a);
        ul.append(li);
      });
      nav.append(ul);
      span.append(nav);
      footer.append(span);
    }

    if (item.label === "copyright-text") {
      let div = document.createElement("div");
      div.className = "copyright-text no-print";
      item.data.forEach(function (copyright) {
        let p = document.createElement("p");
        p.innerHTML = copyright;
        div.append(p);
      });
      footer.append(div);
    }
  });
}

function getElement(tagName, className) {
  let item = document.createElement(tagName);
  item.className = className;
  return item;
}

function getBlogDate(publishDate) {
  const elapsed = Date.now() - Date.parse(publishDate);

  // Time conversions in milliseconds
  const msPerSecond = 1000;
  const msPerMinute = msPerSecond * 60;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  if (elapsed < msPerMinute) {
    const seconds = Math.floor(elapsed / msPerSecond);
    return `${seconds} seconds ago`;
  } else if (elapsed < msPerHour) {
    const minutes = Math.floor(elapsed / msPerMinute);
    return `${minutes} minutes ago`;
  } else if (elapsed < msPerDay) {
    const hours = Math.floor(elapsed / msPerHour);
    return `${hours} hours ago`;
  } else if (elapsed < msPerMonth) {
    const days = Math.floor(elapsed / msPerDay);
    return days == 1 ? `${days} day ago` : `${days} days ago`;
  } else if (elapsed < msPerYear) {
    const months = Math.floor(elapsed / msPerMonth);
    return months == 1 ? `${months} month ago` : `${months} months ago`;
  } else {
    const years = Math.floor(elapsed / msPerYear);
    return years == 1 ? `${years} year ago` : `${years} years ago`;
  }
}
populateBio(bio, "bio");

populateSkills(skills, "skills");

populateBlogs(publications_talks,"blogs")
fetchReposFromGit(gitRepo);
fetchGitConnectedData(gitConnected);

populateExp_Edu(experience, "experience");
populateActivities(activities);
populateExp_Edu(education, "education");

populateLinks(footer, "footer");
