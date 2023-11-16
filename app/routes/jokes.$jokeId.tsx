import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { deleteJoke, updateJoke } from '~/models/joke.server';
import { db } from '~/utils/db.server';
//用来查+删+改数据--get+delete+update，这里查是根据id查找一个数据

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) throw new Response('Joke not found', { status: 404 });
  return json(joke);
};

export default function JokeRoute() {
  const joke = useLoaderData<typeof loader>();

  return (
    <div>
      <p>这是你收集的笑话:</p>
      <p>{joke.content}</p>
      <Link to=".">——"{joke.name}" </Link>
      {/* 因为每个joke的数据不同，所以表单也独一无二，故用key区分 */}
      <Form method="post" key={joke.id}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            defaultValue={joke.name}
            required
            autoFocus
          />
        </label>
        <label>
          Content:
          <textarea
            name="content"
            cols={20}
            rows={5}
            defaultValue={joke.content}
          />
        </label>
        <button type="submit" name="intent" value="update">
          update joke
        </button>
        <button type="submit" name="intent" value="delete">
          delete joke
        </button>
      </Form>
    </div>
  );
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
  //0.验证id
  if (!params.jokeId) throw Error('id出错,请确保id已定义或存在');
  //1-1.收集表单
  const formDate = await request.formData();
  const name = formDate.get('name');
  const content = formDate.get('content');
  const intent = formDate.get('intent');
  //1-2.验证表单数据类型，让 ts 不报错
  if (typeof name !== 'string' || typeof content !== 'string')
    throw new Response('表单数据类型错误', { status: 400 });
  //1-3.验证表单数据规则(服务端)。这里可以return一个错误消息然后保存在变量中，用 useAtionData传给组件并在组件中使用。
  const errors = {
    formErrors: [] as string[],
    filedErrors: [] as string[],
  };
  if (name.trim().length <= 3 && name.trim().length >= 30) {
    errors.filedErrors.push('字符应大于 3 小于 30');
  }
  const hasErrors =
    errors.filedErrors.length > 0 || errors.formErrors.length > 0;
  if (hasErrors) return json(errors, { status: 400 });
  //2.根据表单数据选择操作
  if (intent === 'update') return updateJoke(params.jokeId, { name, content });
  if (intent === 'delete') return deleteJoke(params.jokeId);
  //3.找不到对应操作，返回错误处理
  throw Error('服务器无法识别此操作');

  //2 和 3 也可以合并为 switch 写法。多个操作时可以选择 switch 写法
  // switch(intent){
  //   case 'update':{
  //     return updateJoke(params.jokeId, { name, content })
  //   }
  //   case 'delete':{
  //     return deleteJoke(params.jokeId)
  //   }
  //   default:{
  //     throw Error('服务器无法识别此操作')
  //   }
  // }
};
