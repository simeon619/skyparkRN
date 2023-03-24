import { PostSchema } from '../posts';

export function createRandomPosts(numberOfPosts: number): PostSchema[] {
  const randomPosts: PostSchema[] = [];

  for (let i = 0; i < numberOfPosts; i++) {
    const randomId = Math.floor(Math.random() * 1000000000).toString();
    const randomLikes = Math.floor(Math.random() * 100);
    const randomAuthorId = Math.floor(Math.random() * 1000000000).toString();
    const randomCommentAuthorId = Math.floor(
      Math.random() * 1000000000,
    ).toString();
    const randomTimestamp = Math.floor(Date.now() / 1000).toString();

    const randomImageUrls = [
      'https://picsum.photos/810/1210.jpg',
      'https://picsum.photos/1200/1210.jpg',
      'https://picsum.photos/1400/1210.jpg',
      'https://picsum.photos/1100/1210.jpg',
      'https://picsum.photos/1210/1210.jpg',
      'https://picsum.photos/800/1210.jpg',
      'https://picsum.photos/900/1210.jpg',
  
    ];
    const randomImageUrl =
      randomImageUrls[Math.floor(Math.random() * randomImageUrls.length)];
    const randomCaption = `Random Image Caption ${Math.floor(
      Math.random() * 100,
    )}`;

    const randomCommentContent = `Commentaire  ${Math.floor(
      Math.random() * 100,
    )}  genere par IA`;
    const randomPostContent = `Post  ${Math.floor(
      Math.random() * 100,
    )}  genere par IA On December 18, 2022, footballer Lionel Messi posted a carousel with photos of him lifting the FIFA World Cup`;

    const post: PostSchema = {
      id: randomId,
      author: {
        name: 'John Smith',
        picture:
          'https://fr.seaicons.com/wp-content/uploads/2015/11/Users-User-icon.png',
        id: randomAuthorId,
      },
      type: 'image',
      content: randomPostContent,
      images:[ 
        'https://picsum.photos/1200/1250.jpg',
        'https://picsum.photos/1310/1200.jpg',
        'https://picsum.photos/1210/1210.jpg',
        'https://picsum.photos/1210/1250.jpg',
      ],
      // videos : 'https://www.youtube.com/watch?v=62y60i6k1YM',
      // images:[ 
      //   'https://images.pexels.com/photos/13931403/pexels-photo-13931403.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      //   'https://images.pexels.com/photos/15507656/pexels-photo-15507656.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      //   'https://images.pexels.com/photos/9495080/pexels-photo-9495080.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      //   'https://images.pexels.com/photos/10181220/pexels-photo-10181220.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
      // ],
      likes: randomLikes,
      comments: [
        {
          author: {
            name: 'Jane Doe',
            id: randomCommentAuthorId,
          },
          content: randomCommentContent,
          timestamp: randomTimestamp,
        },
      ],
      timestamp: randomTimestamp,
    };

    randomPosts.push(post);
  }

  return randomPosts;
}
