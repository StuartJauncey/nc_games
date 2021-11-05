const updateVotes = (votes, inc_votes) => {
  let newVotes = 0;
  if (votes.length === 0) {
    newVotes = 0;
  } else {
    newVotes = votes[0].votes + inc_votes;
  }
  return newVotes;
}


module.exports = updateVotes;