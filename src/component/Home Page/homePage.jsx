import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TrendingTweets, TweetFeedAction, TweetFeedAction2, TweetFeedCount, TweetListWithTag } from "../../react-redux/actions/Tweets.jsx";
import Sidebar from "../Sidebar/SideBar";
import "./homepage.css";
import Tweet from "./TweetComp";
import { Spinner } from 'react-bootstrap';
import Loader from "../Assets/Loader.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tweetsearch from "../Sidebar/Tweetsearch.jsx";
import { useNavigate } from "react-router";

function HomePage() {
    const dispatch = useDispatch();

    const { loading, tweetData, liked, bookmarked, privateRoute, trendingTweet } = useSelector((s) => s.TweetFeedReducer)
    const [tweeets, settweets] = useState([])
    console.log(tweetData)
    console.log(trendingTweet)
    const navigate = useNavigate()
    const isUser = localStorage.getItem("access token") ? true : false;
    console.log(isUser)
    useEffect(()=>{
        if(!isUser)
        navigate("/login")
    },[isUser])

    const { response } = useSelector((t) => t.TweetCreateReducer)
    useEffect(() => {
        dispatch(TweetFeedAction())
        dispatch(TrendingTweets())
        document.getElementById("SIDESEARCH").style.display = "none"
        document.getElementById("HOME2").style.display = "flex"
    }, [])

    //    console.log(tweetData)
    //    console.log(trendingTweet)
    //    console.log(liked)
    //    console.log(bookmarked)
    const tweetLength = tweetData.length
    //    const trendTweetLength = tren.length

    const auth = useSelector((s) => s.AuthReducer)
    const { user, toFgtPwd } = auth;
    const nameInApi = user.user_name
    sessionStorage.setItem("usernameInApi", nameInApi)
    const { count } = useSelector((t) => t.TweetFeedCountRed)

    function handleShowMoreTweet() {
        dispatch(TweetFeedCount())
        // console.log(count)
        dispatch(TweetFeedAction2(count))
    }
    // console.log(tweetData)
    const {tagTweets, getTag } = useSelector((ta) => ta.TagTweetFeedReducer)
    function showTagTweet(tag) {
        dispatch(TweetListWithTag(tag))
        console.log("tag tweets")
        if (getTag) {
          navigate("/tagtweet")
        }
    }

    useEffect(() => {
        if (loading === true) {
            document.body.style.opacity = 0.5;
        }
        else {
            document.body.style.opacity = 1;
        }
    }, [loading])
    return <>
        <Sidebar />
        <div className="HOMEPAGE">
            <div className="HOME1">
                <div className="tweetFlexBox POPUPBG">
                    {tweetLength > 0 ? (tweetData.map((tweet, index) => {
                        const likes = liked[index]
                        const bookmarks = bookmarked[index]
                        console.log(likes)
                        return <Tweet text={tweet.text} image={tweet.image} video={tweet.video} likeCount={parseInt(tweet.likes)} retweet={tweet.retweet}
                            username={tweet.user.user_name} displaypic={tweet.user.displaypic} tweetId={tweet._id} number={index} name={tweet.user.name}
                            bookmarked={bookmarks} LIKES={likes} />;
                    })) : null}
                </div>
                <div className="TweetShowMore" onClick={() => { handleShowMoreTweet() }}>...Show More</div>
            </div>
        </div>
        <div id="HOME2">
        <p className="trendTweetHead">#TRENDING</p>
            {trendingTweet.length > 0 ? (trendingTweet.map((trend, index) => {
                return <div className="trendTweet">
                <p className="trendTweetTag" onClick={() => { showTagTweet(trend.hashtag) }}>#{trend.hashtag}</p>
                <p className="trendTweetCount">{trend.tweet_cnt}</p>
                </div>
            })) : null}
        </div>

        {(loading === true) ? <Loader loading={loading} /> : null}
        <ToastContainer />
    </>
}
export default HomePage