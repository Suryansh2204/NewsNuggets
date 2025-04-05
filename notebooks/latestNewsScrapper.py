import requests
import pandas as pd
import re
import bs4
from bs4 import BeautifulSoup
from requests.exceptions import RequestException
import time

def safe_get(url):
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()  # Raise an error for HTTP errors (e.g., 404, 500)
        return response
    except RequestException as e:
        print(f"Error fetching {url}: {e}")
        return None

def get_data(soup):
    title=soup.find("meta", {"property": "og:title"})["content"]
    if title:
        title = title.strip()
    else:
        title=soup.title.string
        index = title.find("-")
        if index != -1:
            title = title[index+1:].strip()
    
    description = soup.find("meta", {"name": "description"})
    if description:
        description = description.get("content", "").strip()
    else:
        description = "No description found"
        
    image=soup.find("meta", {"property": "og:image"})
    if image:
        image = image.get("content", "").strip()
    else:
        image = ""
        
    site_url = soup.find("meta", {"property": "og:url"})
    if site_url:
        site_url = site_url.get("content", "").strip()
    else:
        site_url = ""
    
    paragraphs = soup.find("div", class_="article-content").find_all("p")
    if not paragraphs:
        content=""
    else:
        paragraph_texts = [p.get_text() for p in paragraphs]
        content=" ".join(paragraph_texts).strip()
    
    info=soup.find("div", class_="article-info--col").find_all("p")[0].get_text()
    if info:
        info=info[info.find(":") + 1:].strip()
        publish_date, publish_time=info.split("at")
    else:
        publish_date = ""
        publish_time = ""
    return {
        "title": title,
        "description": description,
        "content": content,
        "image": image,
        "site_url": site_url,
        "publish_date": publish_date.strip(),
        "publish_time": publish_time.strip()
    }

if __name__ == "__main__":
    try:
    # scrape latest news from Bangkok Post
        website_url="https://www.bangkokpost.com"
        latest_news_url = website_url+"/most-recent"
        response = safe_get(latest_news_url)
        if response is not None:
            soup = BeautifulSoup(response.text, "html.parser")
            figures = soup.find("div", class_="page--link").find_all("figure")
            
            # get the latest news links
            links=[]
            for figure in figures:
                link = figure.find("a")
                if link:
                    href = link.get("href")
                    if href:
                        links.append(href.strip())
            links = list(set(links))
            
            # get data from each link
            news=[]
            sleep_for=5 # sleep for 5 seconds between requests to simulate human behavior
            for link in links:
                time.sleep(sleep_for)
                target=website_url + link
                response= safe_get(target)
                if response is not None:
                    soup = BeautifulSoup(response.text, "html.parser")
                    data = get_data(soup)
                    news.append(data)
                else:
                    raise Exception("Failed to fetch a page")
        else:
            raise Exception("Failed to fetch the latest news links.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        print("Scraping completed.")
        print(news)