import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type Image = {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
};

interface GetImageProps {
  data: Image[];
  after: string;
}

export default function Home(): JSX.Element {
  async function getImage({ pageParam = null }): Promise<GetImageProps> {
    const { data } = await api('api/images', {
      params: { after: pageParam },
    });
    return data;
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', getImage, {
    getNextPageParam: lastRequest => lastRequest.after || null,
  });

  const formattedData = useMemo(() => {
    const formattedArray = data?.pages.flatMap(imagesData => {
      return imagesData.data.flat();
    });

    return formattedArray;
  }, [data]);

  if (isLoading && !isError) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? 'carregando...' : 'carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
