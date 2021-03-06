$(document).ready(function () {

  //build up div that contains the new contribution
  const createContributionElem = (contributionObj) => {
    const $contributionObj = $(`
      <div class='reader'>
        <div class='reader-1'>
        <div class='submitted-by'>
       <p>submitted by:</p>
       <p>${contribution.name}</p>
     </div>
        <h3>${escape(contribution.text_addon)} </h3>
        <p>${contribution.accepted_at} </p>
        <div class='count'>${contribution.count}</div>
        <button class='btn' id='like' type="" value="submit"> ✍️ </button>
      </div>
    </div>
    `)
  };

  //loops through all contributions
  const renderContributions = (contributions) => {
    $('#new-contribution').empty();
    for (const contribution of contributions) {
      const $contribution = createContributionElem(contribution);

      $('#new-contribution').prepend($contribution);
    }
  };

  // @TODO A function that we haven't figured out how to implement YET
  const loadContributions = (storyid) => {
    $.ajax({
      url: `/stories/${storyid}`, //????
      method: "GET",
      dataType: 'json',
      success: (contributions) => {
        renderContributions(contributions);
      },
      error: (error) => {
        console.log('error from loadContributions', error);
      }
    });
  };

  /**
   * @param {number} contributionid the id of a specific contribution.
   * @return {boolean} if the upVote was successful.
   */
  const addupVote = function (contributionid) {
    // console.log("WHAT ARE YOU MY GOOD FRIEND", $(this))
    $.ajax({
      url: `/contributions/${contributionid}/upVotes`,
      method: 'POST',
      dataType: 'json',
      success: ({ count }) => {
        $(this).siblings('#count').text(count);
      },
      error: (error) => {
        console.log('error from votes', error);
      }
    });
  };

  // Event listener for like button to upVote
  $(".like-btn").on("click", function (e) {
    // console.log("THIS EEEEEEE", e.target)
    // console.log("CLICK!!!!!!!!");
    let storyid = $(this).attr("story-id")
    let contributionid = $(this).attr("contribution-id")
    // console.log("WHAT IS STORYID", storyid)
    // console.log("WHAT IS CONTRIBUTIONID", contributionid)
    addupVote.call(this, contributionid);
  });

  const escape = function (str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  // A function to dynamically add a contribution to a authors story
  const addContribution = function (storyid, contributionId) {
    // let storyid = $("#mainvalue").val();
    console.log("WHAT ARE YOU????", storyid)
    $.ajax({
      url: `/stories/${storyid}`,
      method: 'PUT',
      dataType: 'json',
      data: { contributionId: contributionId },
      success: (response) => {
        console.log("It works", response)
        $('.append').html('');
        $('.append').append(response[0].storytext);
        for (let text of response) {
          if (text.contributiontext) {
            $('.append').append(`<p>${text.contributiontext}</p>`)
          }
        }
        $('.cont-body.author').hide();
        window.location.reload();
      },
      error: (error) => {
        console.log('error from addContribution', error);
      }
    });
  };

  // Event listener for author add a contribution to his/her story
  $(".add-contribution").on("submit", function (e) {
    e.preventDefault();
    let addStoryId = $(this).children().attr("story-Id")
    const contributionId = $(this).parent().find('#mainvalue').val();
    //@TODO need to fine tune this functionality below to hide div
    // $(this).parent.hide();
    console.log("AM I ADDING THIS", contributionId)
    addContribution(addStoryId, contributionId);
  })

  // @TODO a function we have yet to implement and figure out
  const publishStory = function (storyid) {
    $.ajax({
      url: `/stories/${storyid}/publish`,
      method: 'PUT',
      dataType: 'json',
      data: {},
      success: (response) => {
        console.log("It works", response)
      },
      error: (error) => {
        console.log('error from publishStory', error);
      }
    });
  }

  // @TODO Event listener we have yet to figure out how to implement
  // $(".publish").on("submit", function (e) {
  //   // e.preventDefault();
  //   // const storyId = $('button.publish').attr('publish-id');
  //   // publishStory(storyId);
  //   // let publishStatus = $(this).children().attr("publish-id");
  //   // console.log('THIS IS THIS LOL', publishStatus);

  // })
});

