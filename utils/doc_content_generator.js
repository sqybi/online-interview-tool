async function generate_chinese(params) {
    return '图森在线面试\n面试者：' + params.name + '\n面试时间：' + params.iyear + '-' + params.imonth + '-' + params.idate + ' ' + params.ihour + ':' + params.iminute + ' UTC+0800\n';
}

async function generate_english(params) {
    return 'TuSimple Online Interview\nCandidate name: ' + params.name + '\nScheduled time: ' + params.imonth + '/' + params.idate + '/' + params.iyear + ' ' + params.ihour + ':' + params.iminute + ' UTC+0800\n';
}

module.exports = {
    generate: async function (params) {
        switch (params.lang) {
            case 'chinese':
                return await generate_chinese(params);
            case 'english':
                return await generate_english(params);
            default:
                return '';
        }
    }
};