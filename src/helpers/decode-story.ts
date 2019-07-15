const hex2ascii = require('hex2ascii')

export const decodeStory = (blockData: any): any => {
    if (!blockData || !blockData.body || !blockData.body.star || !blockData.body.star.story)
        return blockData;

    return {
        ...blockData, body: {
            ...blockData.body,
            star: {
                ...blockData.body.star,
                storyDecoded: hex2ascii(blockData.body.star.story)
            }
        }
    };
}