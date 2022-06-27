#json.array! @analyses, :id, :name, :cover_image, :mid, :description, :multiple_mid

json.array! @pipelines do |pipeline|
    json.name pipeline.name
    json.pid pipeline.pid
    json.multiple_pid pipeline.multiple_pid
    json.single_demo_id pipeline.single_demo_id
    json.multiple_demo_id pipeline.multiple_demo_id
    json.single_result_id pipeline.single_result_id
    json.multiple_result_id pipeline.multiple_result_id
    json.rendered_doc pipeline.rendered_doc
    json.cover_image pipeline.cover_image
end