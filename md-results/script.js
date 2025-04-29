document.addEventListener('DOMContentLoaded', function() {
    const data = `jurisdiction,harris,trump,oliver,stein,kennedy,others,total
Allegany,9231,22141,130,136,363,136,32137
Anne Arundel,171945,128892,2141,2429,3375,2790,311572
Baltimore City,195109,27984,892,3222,1875,1672,230754
Baltimore County,249958,149560,2240,4195,3858,3104,412915
Calvert,23438,29361,297,232,554,309,54191
Caroline,4860,11053,84,99,180,54,16330
Carroll,36867,62273,845,629,1182,855,102651
Cecil,17628,33871,291,286,536,219,52831
Charles,63454,26145,334,828,889,447,92097
Dorchester,6954,9390,57,138,191,42,16772
Frederick,82409,68753,970,1378,1494,1110,156114
Garrett,3456,11983,75,48,223,53,15838
Harford,62453,83050,1023,935,1559,1070,150090
Howard,124764,49425,1246,3341,1712,1803,182291
Kent,5251,5561,60,82,114,60,11128
Montgomery,386581,112637,2416,8009,4276,5302,519221
Prince George's,347038,45008,1038,5369,3428,2128,404009
Queen Anne's,11273,20200,174,153,336,211,32347
Saint Mary's,23531,33582,409,352,669,411,58954
Somerset,4054,5805,32,85,114,47,10137
Talbot,11119,11125,109,120,194,163,22830
Washington,27260,44054,363,513,811,331,73332
Wicomico,21513,24065,205,371,544,214,46912
Worcester,12431,19632,139,184,342,153,32881`;

    const lines = data.trim().split('\n');
    const headers = lines[0].split(',');
    const candidateNames = headers.slice(1, -1);
    const countyData = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const county = values[0];
        const votes = values.slice(1).map(Number);
        const total = votes.pop();
        const candidateVotes = {};
        candidateNames.forEach((name, index) => {
            candidateVotes[name] = votes[index];
        });
        countyData.push({ jurisdiction: county, votes: candidateVotes, total: total });
    }

    // Calculate statewide totals and percentages
    const statewideTotals = {};
    let statewideTotalVotes = 0;
    candidateNames.forEach(name => statewideTotals[name] = 0);

    countyData.forEach(county => {
        statewideTotalVotes += county.total;
        candidateNames.forEach(name => {
            statewideTotals[name] += county.votes[name];
        });
    });

    const statewidePercentagesDiv = document.getElementById('statewide-totals');
    let statewidePercentagesHTML = '<h2>Statewide Percentages</h2><ul>';
    candidateNames.forEach(name => {
        const percentage = ((statewideTotals[name] / statewideTotalVotes) * 100).toFixed(2);
        statewidePercentagesHTML += `<li>${name}: ${percentage}% (${statewideTotals[name]} votes)</li>`;
    });
    statewidePercentagesHTML += `<li><strong>Total Votes: ${statewideTotalVotes}</strong></li></ul>`;
    statewidePercentagesDiv.innerHTML = statewidePercentagesHTML;

    // Populate the county dropdown
    const countyDropdown = document.getElementById('county-dropdown');
    countyData.forEach(county => {
        const option = document.createElement('option');
        option.value = county.jurisdiction;
        option.textContent = county.jurisdiction;
        countyDropdown.appendChild(option);
    });

    // Handle county selection
    const countyPercentagesDiv = document.getElementById('county-percentages');
    countyDropdown.addEventListener('change', function() {
        const selectedCounty = this.value;
        if (selectedCounty) {
            const county = countyData.find(c => c.jurisdiction === selectedCounty);
            let countyPercentagesHTML = `<h3>${selectedCounty} Percentages</h3><ul>`;
            candidateNames.forEach(name => {
                const percentage = ((county.votes[name] / county.total) * 100).toFixed(2);
                countyPercentagesHTML += `<li>${name}: ${percentage}% (${county.votes[name]} votes)</li>`;
            });
            countyPercentagesHTML += `<li><strong>Total Votes: ${county.total}</strong></li></ul>`;
            countyPercentagesDiv.innerHTML = countyPercentagesHTML;
        } else {
            countyPercentagesDiv.innerHTML = '<p>Select a county to see candidate percentages.</p>';
        }
    });
});
