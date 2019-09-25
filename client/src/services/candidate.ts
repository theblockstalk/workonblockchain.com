export const candidateBadge = function(candidate){
  let candidateDoc = candidate['candidate'];
  let latest_status = candidateDoc.latest_status.status;
  let candBadge : any = {};

  if (latest_status === 'wizard completed' || latest_status === 'updated' || latest_status === 'reviewed') {
    let twoDaysAgo = new Date();
    let fourDaysAgo = new Date();
    twoDaysAgo.setSeconds(twoDaysAgo.getSeconds() - 172800);
    fourDaysAgo.setSeconds(fourDaysAgo.getSeconds() - 345600);
    let last_status_date = new Date(candidateDoc.latest_status.timestamp);

    if (latest_status === 'reviewed') {
      for (let item of candidateDoc.history) {
        if (item.status && (item.status.status === 'wizard completed' || item.status.status === 'updated')) {
          last_status_date = item.timestamp;
          break;
        }
      }
    }

    let candidateProgr = candidateProgress(candidate);
    let priorityReached = candidateProgr === 100;
    let twoDayReached = candidateProgr >=50;

    if (priorityReached ||
      (twoDayReached && last_status_date < twoDaysAgo) ||
      last_status_date < fourDaysAgo ) {
      candBadge = setBadge('Priority', 'danger');
    } else if (twoDayReached ||
      last_status_date < twoDaysAgo) {
      candBadge = setBadge('2 days till review', 'warning');
    } else {
      candBadge = setBadge('4 days till review', 'info');
    }
  } else {
    latest_status = latest_status.charAt(0).toUpperCase()+''+latest_status.slice(1);
    candBadge = setBadge(latest_status, 'info');
  }
  return candBadge;
}

export const setBadge = function(text, classColour){
  let candBadge : any = {};
  candBadge.candidate_badge = text;
  candBadge.candidate_badge_color = classColour;
  return candBadge;
}

export const candidateProgress = function(candidate){
  let linking_accounts = 0;
  let candidateDoc = candidate['candidate'];
  if (candidateDoc.github_account) linking_accounts++;
  if (candidateDoc.stackexchange_account) linking_accounts++;
  if (candidateDoc.linkedin_account) linking_accounts++;
  if (candidateDoc.medium_account) linking_accounts++;
  if (candidateDoc.stackoverflow_url) linking_accounts++;
  if (candidateDoc.personal_website_url) linking_accounts++;

  if (linking_accounts < 2) return 15;

  if(!candidateDoc.work_history) return 25;
  if(candidateDoc.work_history) {
    for (let work_item of candidateDoc.work_history) {
      if (!work_item.description || work_item.description.length < 40) return 25;
    }
  }

  if(candidateDoc.blockchain) {
    let blockchain = candidateDoc.blockchain;
    if (blockchain.commercial_platforms && blockchain.commercial_platforms.length > 0 && (!blockchain.description_commercial_platforms || blockchain.description_commercial_platforms.length < 40)) return 50;
    if (blockchain.experimented_platforms && blockchain.experimented_platforms.length > 0 && (!blockchain.description_experimented_platforms || blockchain.description_experimented_platforms.length < 40)) return 50;
    if (blockchain.commercial_skills && blockchain.commercial_skills.length > 0 && (!blockchain.description_commercial_skills || blockchain.description_commercial_skills.length < 40)) return 50;
  }

  if (!candidate.image) return 75;

  return 100;
}
