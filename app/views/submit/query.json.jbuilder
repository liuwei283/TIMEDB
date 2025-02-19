#json.array! @analyses, :id, :name, :cover_image, :mid, :description, :multiple_mid

json.pipelines do
    json.array! @analyses do |analysis|
        json.name analysis.name
        json.mid analysis.mid
        json.cover_image analysis.cover_image
        json.single_demo_id analysis.single_demo_id
        json.multiple_demo_id analysis.multiple_demo_id
        json.single_result_id analysis.single_result_id
        json.multiple_result_id analysis.multiple_result_id
    end
end

json.analyses do
    json.array! @pipelines do |analysis|
        json.name analysis.name
        json.pid analysis.pid
        json.cover_image analysis.cover_image
        json.single_demo_id analysis.single_demo_id
        json.multiple_demo_id analysis.multiple_demo_id
        json.single_result_id analysis.single_result_id
        json.multiple_result_id analysis.multiple_result_id
    end
end