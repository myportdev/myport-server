import awsParamStore from "aws-param-store";
const param_name = "folio-parameter";
const region = "ap-northeast-2";

const aws_parameter_store = () => {
    const parameter = awsParamStore.getParameterSync(param_name, { region });
    return JSON.parse(parameter.Value);
};

export default aws_parameter_store;
