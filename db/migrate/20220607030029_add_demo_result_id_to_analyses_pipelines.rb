class AddDemoResultIdToAnalysesPipelines < ActiveRecord::Migration[6.0]
  def change
    add_column :analyses, :single_result_id, :int, :default=> -1
    add_column :analyses, :multiple_result_id, :int, :default=> -1
    add_column :analysis_pipelines, :single_result_id, :int, :default=> -1
    add_column :analysis_pipelines, :multiple_result_id, :int, :default=> -1
  end
end
