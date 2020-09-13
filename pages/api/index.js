import axios from 'axios';

const styles = `
<style>
.container {
  height: 150px;
  width: 400px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
}
.card {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  padding-bottom: 10px;
}
.avatar {
  height: 100px;
  width: 100px;
}
.user-detail {
  padding-left: 10px;
}
.card-bottom {
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-top: 1px solid #cccccc;
}
p {
  margin: 0px;
  padding: 0px;
  font-weight: 300;
  font-size: 14px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
h5 {
  margin: 0px;
  padding-bottom: 6px;
  font-weight: 400;
  font-size: 18px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
.icon {
  height: 16px;
  width: 16px;
}
.link {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
`;

const body = ({ full_name, profile_pic_url_hd, biography, followersCount }) => {
  return (
    `
<body>
<div class="container">
  <div style="border-width:10px;" class="card">
    <img
      class="avatar"
      style="border-radius: 10px;"
      src=${profile_pic_url_hd}
    />
    <div class="user-detail">
      <h5>${full_name}</h5>
      <p>
        ${biography}
      </p>
    </div>
  </div>
  <div class="card-bottom">
    <p>${followersCount} Followers</p>
    <a class="link"><p>View</p>
    <img
      class="icon"
      src="https://img.icons8.com/ios-glyphs/30/000000/chevron-right.png"
    />
  </a>
  </div>
</div>
</body>`
  )
};

module.exports = async (req, res) => {
  return new Promise(resolve => {
    const {
      instaId
    } = req?.query;
    if (instaId) {
      const url = `https://www.instagram.com/${instaId}/?__a=1`;
      axios({
        method: 'GET',
        url, headers:
        {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        }
      }).then((response) => {
        console.log(response.data, "Response");
        try {
          const {
            graphql: {
              user: {
                full_name,
                biography,
                edge_follow: {
                  count: followCount
                },
                edge_followed_by: {
                  count: followersCount
                },
                profile_pic_url_hd,
                username
              }
            }
          } = response?.data;
          res.send(`<html lang="en">
                    ${styles}
                    ${body({ full_name, biography, followersCount, profile_pic_url_hd, username })}
                </html>`
          );
          return resolve();
        } catch (e) {
          console.warn(e);
          res.send(`<html> <p>Invalid username!</p> ${JSON.stringify(e)} </html>`);
          return resolve();
        }
      }).catch(e => {
        console.warn(e);
        res.send('<html> <p>Server Error, Raise an Issue!</p> </html>');
        return resolve();
      });

    }
    else {
      res.send('<html> <p>Username undefined!</p> </html>');
      return resolve();
    }
  })
}