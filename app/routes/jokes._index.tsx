import { redirect, type ActionFunctionArgs } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { db } from '~/utils/db.server';
//用来创建数据--增create
export const action = async ({ request }: ActionFunctionArgs) => {
  //1.收集表单数据
  const formData = await request.formData();
  const name = formData.get('name');
  const content = formData.get('content');
  //2.验证表单数据的类型
  if (typeof name !== 'string' || typeof content !== 'string')
    throw Error('表单数据类型错误');
  //3.根据表单数据创建新joke
  const joke = await db.joke.create({
    data: {
      name,
      content,
    },
  });
  //4.重定向到主页面
  return redirect(`/jokes/${joke.id}`);
};

export default function JokesIndex() {
  return (
    <div>
      <p>添加你自己的笑话</p>
      {/* 因为jokes._index.tsx 与 jokes.tsx 路由一样，使用action来区分它们 */}
      <Form method="post" action="/jokes/?index">
        <div>
          <label>
            Name: <input type="text" name="name" />
          </label>
        </div>
        <div>
          <label>
            Content: <textarea name="content" />
          </label>
        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </Form>
    </div>
  );
}
