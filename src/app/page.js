"use client";
import React, { useEffect, useContext, useState } from "react";

// INTERNAL IMPORT
import { CrowdFundingContext } from "../../Context/CrowdFunding.js";
import { Hero, Card, PopUp } from '../../Components';

const page = () => {
  const {
    titleData,
    getCampaigns,
    createCampaign,
    donate,
    getUserCampaigns,
    getDonations,
  } = useContext(CrowdFundingContext);

  const [allcampaign, setAllCampaigns] = useState([]);
  const [usercampaign, setUsercampaign] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [donateCampaign, setDonateCampaign] = useState();

  // Fetch campaigns when the component mounts
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // Fetch data from the context functions
        const allData = await getCampaigns();
        const userData = await getUserCampaigns();

        // Debug logs
        console.log("All campaigns:", allData); 
        console.log("User campaigns:", userData);

        // Update state with fetched data
        setAllCampaigns(allData);
        setUsercampaign(userData);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };

    fetchCampaigns(); // Call the fetch function
  }, [getCampaigns, getUserCampaigns]); // Dependencies ensure it reruns if these change

  console.log(donateCampaign); // Existing debug log for donation

  return (
    <>
      <Hero titleData={titleData} createCampaign={createCampaign} />
      <Card
        title="All Listed Campaigns"
        allcampaign={allcampaign}
        setOpenModel={setOpenModel}
        setDonate={setDonateCampaign} 
      />
      <Card
        title="Your Created Campaign"
        allcampaign={usercampaign}
        setOpenModel={setOpenModel}
        setDonate={setDonateCampaign}
      />
      {openModel && (
        <PopUp
          setOpenModel={setOpenModel}
          getDonations={getDonations}
          donate={donateCampaign}
          donateFunction={donate}
        />
      )}
    </>
  );
};

export default page;
