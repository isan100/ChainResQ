import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Heart,
  TrendingUp,
  Users,
  Vote,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react";

export default function CommunityReliefApp() {
  const [activeTab, setActiveTab] = useState("donate");
  const [donations, setDonations] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [totalFunds, setTotalFunds] = useState(0);
  const [deployedFunds, setDeployedFunds] = useState(0);
  const [donationAmount, setDonationAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load data from storage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load donations
      const donationsResult = await window.storage.get("donations", true);
      if (donationsResult) {
        const loadedDonations = JSON.parse(donationsResult.value);
        setDonations(loadedDonations);
        calculateTotals(loadedDonations);
      }

      // Load proposals
      const proposalsResult = await window.storage.get("proposals", true);
      if (proposalsResult) {
        setProposals(JSON.parse(proposalsResult.value));
      } else {
        // Initialize with sample proposals
        const initialProposals = [
          {
            id: 1,
            title: "Emergency Food Supplies",
            description:
              "Purchase and distribute food packages to 50 families affected by recent flooding",
            amount: 5000,
            emergency: "Flooding",
            votes: 0,
            status: "active",
            createdAt: Date.now(),
          },
          {
            id: 2,
            title: "Medical Supplies & First Aid",
            description:
              "Acquire essential medical supplies and first aid kits for community health workers",
            amount: 3000,
            emergency: "Disease Outbreak",
            votes: 0,
            status: "active",
            createdAt: Date.now(),
          },
          {
            id: 3,
            title: "Temporary Shelter Materials",
            description:
              "Provide tarpaulins, tents, and basic shelter materials for displaced families",
            amount: 4500,
            emergency: "Storm Damage",
            votes: 0,
            status: "active",
            createdAt: Date.now(),
          },
        ];
        await window.storage.set(
          "proposals",
          JSON.stringify(initialProposals),
          true
        );
        setProposals(initialProposals);
      }

      // Load user votes
      const votesResult = await window.storage.get("user_votes", false);
      if (votesResult) {
        setUserVotes(JSON.parse(votesResult.value));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const calculateTotals = (donationsList) => {
    const total = donationsList.reduce((sum, d) => sum + d.amount, 0);
    setTotalFunds(total);
    // Calculate deployed funds from approved proposals
    const deployed = 0; // This would be calculated from approved proposals
    setDeployedFunds(deployed);
  };

  const handleDonate = async () => {
    const amount = parseFloat(donationAmount);
    if (!amount || amount <= 0 || !donorName.trim()) {
      alert("Please enter a valid amount and your name");
      return;
    }

    const newDonation = {
      id: Date.now(),
      amount,
      donor: donorName.trim(),
      timestamp: Date.now(),
      anonymous: false,
    };

    const updatedDonations = [...donations, newDonation];
    setDonations(updatedDonations);
    calculateTotals(updatedDonations);

    try {
      await window.storage.set(
        "donations",
        JSON.stringify(updatedDonations),
        true
      );
      setDonationAmount("");
      setDonorName("");
      alert(
        "Thank you for your donation! Your contribution will help the community."
      );
    } catch (error) {
      console.error("Error saving donation:", error);
      alert("There was an error saving your donation. Please try again.");
    }
  };

  const handleVote = async (proposalId) => {
    if (userVotes[proposalId]) {
      alert("You have already voted on this proposal");
      return;
    }

    const updatedProposals = proposals.map((p) =>
      p.id === proposalId ? { ...p, votes: p.votes + 1 } : p
    );
    setProposals(updatedProposals);

    const updatedVotes = { ...userVotes, [proposalId]: true };
    setUserVotes(updatedVotes);

    try {
      await window.storage.set(
        "proposals",
        JSON.stringify(updatedProposals),
        true
      );
      await window.storage.set(
        "user_votes",
        JSON.stringify(updatedVotes),
        false
      );
    } catch (error) {
      console.error("Error saving vote:", error);
    }
  };

  const availableFunds = totalFunds - deployedFunds;

  const emergencyColors = {
    Flooding: "bg-blue-100 text-blue-800",
    "Disease Outbreak": "bg-red-100 text-red-800",
    "Storm Damage": "bg-purple-100 text-purple-800",
    Fire: "bg-orange-100 text-orange-800",
    Earthquake: "bg-yellow-100 text-yellow-800",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Community Relief Hub
                </h1>
                <p className="text-sm text-gray-600">
                  Empowering communities to respond together
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Available Funds</p>
              <p className="text-3xl font-bold text-green-600">
                ${availableFunds.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold text-indigo-600">
                  ${totalFunds.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-indigo-300" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Community Donors</p>
                <p className="text-2xl font-bold text-blue-600">
                  {donations.length}
                </p>
              </div>
              <Users className="h-10 w-10 text-blue-300" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Proposals</p>
                <p className="text-2xl font-bold text-purple-600">
                  {proposals.filter((p) => p.status === "active").length}
                </p>
              </div>
              <Vote className="h-10 w-10 text-purple-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("donate")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "donate"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Heart className="h-5 w-5 inline mr-2" />
              Make Donation
            </button>
            <button
              onClick={() => setActiveTab("donations")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "donations"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <TrendingUp className="h-5 w-5 inline mr-2" />
              View Donations
            </button>
            <button
              onClick={() => setActiveTab("proposals")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "proposals"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Vote className="h-5 w-5 inline mr-2" />
              Vote on Proposals
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {activeTab === "donate" && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Make a Donation
                </h2>
                <p className="text-gray-600">
                  Your contribution helps communities respond to emergencies
                  quickly and effectively
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Donation Amount ($)
                  </label>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="1"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-2">
                  {[10, 25, 50, 100, 500].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDonationAmount(amount.toString())}
                      className="flex-1 py-2 px-4 border-2 border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleDonate}
                  className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
                >
                  Donate Now
                </button>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">
                        Community-Driven Deployment
                      </p>
                      <p>
                        All donations are shared with the community. Members
                        vote democratically on how funds should be deployed to
                        address emergencies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "donations" && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Donation History
              </h2>
              <p className="text-gray-600">
                Transparent record of all community contributions
              </p>
            </div>

            {donations.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">
                  No donations yet. Be the first to contribute!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {donations
                  .slice()
                  .reverse()
                  .map((donation) => (
                    <div
                      key={donation.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-green-100 rounded-full p-3">
                            <Heart className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {donation.donor}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(donation.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            ${donation.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "proposals" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Fund Deployment Proposals
              </h2>
              <p className="text-gray-600 mb-4">
                Vote on how community funds should be deployed to address
                emergencies
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Vote className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">
                      Democratic Decision Making
                    </p>
                    <p>
                      Each community member gets one vote per proposal.
                      Proposals with majority support are prioritized for
                      funding based on available resources.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {proposals.map((proposal) => (
              <div
                key={proposal.id}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {proposal.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          emergencyColors[proposal.emergency] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {proposal.emergency}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{proposal.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <p className="text-sm text-indigo-600 font-medium mb-1">
                      Requested Amount
                    </p>
                    <p className="text-2xl font-bold text-indigo-900">
                      ${proposal.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-600 font-medium mb-1">
                      Community Votes
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      {proposal.votes}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleVote(proposal.id)}
                  disabled={userVotes[proposal.id]}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    userVotes[proposal.id]
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {userVotes[proposal.id] ? (
                    <span className="flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      You Voted for This
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Vote className="h-5 w-5 mr-2" />
                      Vote for This Proposal
                    </span>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
