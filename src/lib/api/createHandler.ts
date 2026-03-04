import { NextRequest, NextResponse } from "next/server";
import { createLimiterHandler } from "./rateLimiting";
import { errorHandler } from "./errorHandler";

export type NextHandler = (
  req: NextRequest,
  ...args: any[]
) => Promise<NextResponse>;

export const createRegularHandler = (
  handler: NextHandler,
  optionsParameter?: {
    limiter?: {
      requestPerDuration: number;
      durationSeconds: number;
    };
  },
) => {
  const options = {
    limiter: {
      // 60 request per 60 seconds
      requestPerDuration: 2,
      durationSeconds: 60,
      ...optionsParameter?.limiter,
    },
  };

  const limiterHandler = createLimiterHandler(
    options.limiter.requestPerDuration,
    options.limiter.durationSeconds,
  );

  const wrapperHandler = async (req: NextRequest, ...args: any[]) => {
    try {
      await limiterHandler(req);

      const result = await handler(req, ...args);
      return result;
    } catch (err: unknown) {
      return errorHandler(req, err);
    }
  };

  return wrapperHandler;
};

// /**
//  * runs a series of handlers sequenccially. the first handler to return a response will be used
//  */
// export const composeHandlers = (...handlers: NextHandler[]): NextHandler => {
//   const wrapperHandler = async (req: NextRequest, ...args: any[]) => {
//     let error: any = undefined;

//     for (const handler of handlers) {
//       try {
//         // handlerParamsNum=2 - error handler
//         // handlerParamsNum=1 - regular handler
//         const paramsNumber = handler.length;

//         if (error) {
//           if (paramsNumber == 2) {
//             const result = await handler(req, error);

//             if (result) {
//               return result;
//             }
//           }
//         } else {
//           const result = await handler(req, ...args);

//           if (result) {
//             return result;
//           }
//         }
//       } catch (err: any) {
//         error = err;
//       }
//     }

//     // all handlers has been exhausted and there is still an error
//     if (error) {
//       return NextResponse.json({ status: "error" }, { status: 500 });
//     }

//     // handlers exhausted, no error, just return success
//     return NextResponse.json(
//       { error: "No handler returned a response" },
//       { status: 500 },
//     );
//   };

//   return wrapperHandler;
// };
