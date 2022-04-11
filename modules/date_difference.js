const date_difference = (str_date) => {
    const date_array = str_date.split("-");
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let end_date = new Date(parseInt(date_array[0]), parseInt(date_array[1]), parseInt(date_array[2]));
    let now_date = new Date(year, month, day);
    let time_remaining = end_date.getTime() - now_date.getTime();
    let d_day = time_remaining / (1000 * 60 * 60 * 24) + 1;
    return d_day;
};

export default date_difference;
