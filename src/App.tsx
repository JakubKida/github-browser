import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

interface Repo {
  id: number;
  name: string;
  owner: string;
  url: string;
  seeDetails: boolean;
  seeDetailsURL: string;
  contributors: string[];
}

function App() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const getRepos = async (nameQuery: string): Promise<void> => {
    const response = await axios.get(
      `https://api.github.com/search/repositories?q=${nameQuery}&per_page=5`,
      {
        headers: {
          Authorization: `token ***`,
        },
      }
    );

    setRepos(
      response.data.items.map(
        (rawData: any) =>
          ({
            id: rawData.id,
            name: rawData.name,
            owner: rawData.owner.login,
            url: rawData.html_url,
            seeDetails: false,
            seeDetailsURL: rawData.contributors_url,
            contributors: [""],
          } as Repo)
      )
    );

    // response.data.items.map(async (rawData: any) => {
    //   const contributors: any = (
    //     await axios.get(rawData.contributors_url, {
    //       headers: {
    //         Authorization: `token ***`,
    //       },
    //     })
    //   ).data;
    // });
  };

  const getRepoDetails = async (index: number) => {
    const items = [...repos];
    const repoToExpand = items[index];

    const response = await axios.get(repoToExpand.seeDetailsURL);
    // debugger;
    repoToExpand.contributors = response.data.map(
      (contributor: any) => contributor.login
    );
    repoToExpand.seeDetails = true;
    setRepos([...items]);
  };

  useEffect(() => {
    // axios
    //   .get<Repo[]>(
    //     "https://api.github.com/orgs/facebook/repos?sort=created&per_page=100&page=1"
    //   )
    //   .then((response: AxiosResponse) => {
    //     setRepos(
    //       response.data.map((rawData: any) => ({
    //         id: rawData.id,
    //         name: rawData.name,
    //         owner: rawData.owner.login,
    //         url: rawData.html_url,
    //       }))
    //     );
    //   });
    // getRepos();
    setTimeout(() => console.log(repos), 1000);
  }, []);

  const handleQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="App">
      Bonjour from react-typescript
      <form>
        <input type="text" onChange={handleQueryChange} value={searchQuery}></input>
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            getRepos(searchQuery);
          }}
        >
          Search
        </button>
      </form>
      <ul>
        {repos &&
          repos.map((repo, index) => (
            <li key={repo.id}>
              {repo.name} {repo.owner}
              <a href={repo.url}>Link</a>
              {repo.seeDetails ? (
                <div>
                  <button> Hide Details </button>
                  {repo.contributors.map((contributor) => (
                    <span>{contributor}, </span>
                  ))}
                </div>
              ) : (
                <button onClick={(e) => getRepoDetails(index)}> See Details </button>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
