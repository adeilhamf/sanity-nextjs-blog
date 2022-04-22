import imageUrlBuilder from '@sanity/image-url'
import { useEffect, useState } from 'react'
import style from '../../styles/Post.module.css'
import BlockContent from '@sanity/block-content-to-react'
import { Toolbar } from '../../component/toolbar'

const Post = ({ title, body, image }) => {
    const [imageUrl, setImageUrl] = useState('')

    useEffect(()=>{
        const imgBuilder = imageUrlBuilder({
            projectId: 'hunnmjyr',
            dataset: 'production',
        })
        setImageUrl(imgBuilder.image(image))
    }, [image])
  return (
      <div>
          <Toolbar/>
        <div className={style.main}>
                <h1>{title}</h1>
            {imageUrl && <img className={style.mainImage} src={imageUrl}/>}

            <div className={style.body}>
                <BlockContent blocks={body}/>
            </div>
        </div>
      </div>
  )
}

export const getServerSideProps = async pageContext => {
    const pageSlug = pageContext.query.slug;
    
    if (!pageSlug) {
      return {
        notFound: true
      }
    }
  
    const query = encodeURIComponent(`*[ _type == "post" && slug.current == "${pageSlug}" ]`);
    const url = `https://hunnmjyr.api.sanity.io/v1/data/query/production?query=${query}`;
  
    const result = await fetch(url).then(res => res.json());
    const post = result.result[0];
  
    if (!post) {
      return {
        notFound: true
      }
    } else {
      return {
        props: {
          body: post.body,
          title: post.title,
          image: post.mainImage,
        }
      }
    }
  };

export default Post